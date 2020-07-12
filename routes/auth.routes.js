const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  if (!username || !email || !password) {
    res.status(500).json({
      errorMessage: "Please enter username, email and password",
    });
    return;
  }
  console.log('ERROR CHECK 1')
  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );
  if (!myRegex.test(email)) {
    res.status(500).json({
      errorMessage: "Email format not correct",
    });
    return;
  }
  
  const myPassRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  );
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Password needs to have 8 characters, a number and an Uppercase alphabet",
    });
    return;
  }

  bcrypt.genSalt(12).then((salt) => {
    console.log("Salt: ", salt);
    bcrypt.hash(password, salt).then((passwordHash) => {
      UserModel.create({ email, username, passwordHash })
        .then((user) => {
          req.session.loggedInUser = user;
          console.log(req.session);
          res.status(200).json(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(500).json({
              errorMessage: "username or email entered already exists!",
            });
            return;
          } else {
            res.status(500).json({
              errorMessage: "Something went wrong! Go to sleep!",
            });
            return;
          }
        });
    });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).json({
      error: "Please enter username and password",
    });
    return;
  }
  // const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  // if (!myRegex.test(email)) {
  //     res.status(500).json({
  //         error: 'Email format not correct',
  //     })
  //     return;
  // }

  // Find if the user exists in the database
  UserModel.findOne({ username })
    .then((userData) => {
      //check if passwords match
      bcrypt
        .compare(password, userData.passwordHash)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            req.session.loggedInUser = userData;
            console.log("Signin", req.session);
            res.status(200).json(userData);
          }
          //if passwords do not match
          else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      res.status(500).json({
        error: "Email format not correct",
        message: err,
      });
      return;
    });
});

router.get("/logout", (req, res) => {
  console.log('before', req.session)
  req.session.destroy();
  console.log('after', req.session)
  res
    .status(204) //  No Content
    .send();
});

router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

router.get("/userData", isLoggedIn, (req, res, next) => {
  const { loggedInUser } = req.session;
  UserModel.findById(loggedInUser)
    .populate('list.mediaId')
    .then((user) => {
      console.log(user)
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.post('/checkUsername', (req, res, next) => {
  const { username } = req.body
  UserModel.find({ username })
    .then((response) => {
      if (response.length === 0) {
        res.status(200).json(false)
      } else {
        res.status(200).json(true)
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
})

router.post('/checkEmail', (req, res, next) => {
  const { email } = req.body
  UserModel.find({ email })
    .then((response) => {
      if (response.length === 0) {
        res.status(200).json(false)
      } else {
        res.status(200).json(true)
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
})

module.exports = router;
