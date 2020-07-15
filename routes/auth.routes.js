const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn

// This route handles the sign up form
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

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

// This route handles the log in form
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).json({
      error: "Please enter username and password",
    });
    return;
  }

  // Find existing user in User Model
  UserModel.findOne({ username })
    .then((userData) => {
      // Use bcrypt to check if passwords match
      bcrypt
        .compare(password, userData.passwordHash) // Method of Bcrypt
        .then((doesItMatch) => {
          // If password DOES match:
          if (doesItMatch) {
            // req.session is the special object that is available
            // Make the session user equal to the userData
            req.session.loggedInUser = userData;
            res.status(200).json(userData);
          }
          // If password DOES NOT match
          else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "Something went wrong",
          });
          return;
        });
    })
    // Throw an error if the user does not exist
    .catch((err) => {
      res.status(500).json({
        error: "User does not exist",
        message: err,
      });
      return;
    });
});

// This route handles logging out and destroying the session
router.get("/logout", (req, res) => {
  req.session.destroy();
  res
    .status(204) //  No Content
    .send();
});

// This route handles getting the session user
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

// This route handles getting the most updated version of the user from the User Model, mainly used for the updating of the list
router.get("/userData", isLoggedIn, (req, res, next) => {
  const { loggedInUser } = req.session;

  // Find the user
  UserModel.findById(loggedInUser)
    .populate('list.mediaId') // populate with Media Model reference for everything in the user's list
    .then((user) => {
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

// This route is used in the sign in form, for checking if the username already exists
router.post('/checkUsername', (req, res, next) => {
  // Receives a username from req.body onChange event
  const { username } = req.body
  UserModel.find({ username })
    .then((response) => {
      // If username does not exist:
      if (response.length === 0) {
        res.status(200).json(false)
      }
      // If username does exist:
      else {
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

// This route is used in the sign in form, for checking if the email is already in use
router.post('/checkEmail', (req, res, next) => {
  // Receives a email from req.body onChange event
  const { email } = req.body
  UserModel.find({ email })
    .then((response) => {
      // If email does not exist:
      if (response.length === 0) {
        res.status(200).json(false)
      }
      // If email does exist:
      else {
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