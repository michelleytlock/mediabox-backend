const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn
const UserModel = require("../models/User.model");
let MediaModel = require("../models/Media.model");
const Mongoose = require("mongoose");

router.post("/create", isLoggedIn, (req, res) => {
  console.log(req.body);
  const {
    mediaType,
    apiId,
    listType,
    rating,
    description,
    title,
    image,
  } = req.body;

  console.log(apiId);

  const { loggedInUser } = req.session;

  MediaModel.find({ apiId })
    .then((media) => {
      console.log(media);
      console.log(media.length);
      if (media.length == 0) {
        MediaModel.create({
          apiId,
          mediaType,
          title,
          description,
          image,
        })
          .then((createdMedia) => {
            console.log(createdMedia)
            let item = { mediaId: createdMedia._id, apiId, listType, rating };
            //find if item is in usermodel already
            UserModel.findByIdAndUpdate(loggedInUser, {
              $push: { list: item },
            })
              .then((response) => {
                // console.log('usermodel' + response)
                res.status(200).json(response);
              })
              .catch((err) => {
                res.status(501).json({
                  error: "Something went wrong",
                  message: err,
                });
              });
          })
          .catch((err) => {
            res.status(502).json({
              error: "Something went wrong",
              message: err,
            });
          });
      } else {
        let item = { mediaId: media._id, apiId, listType, rating };
        UserModel.findByIdAndUpdate(loggedInUser, {
          $push: { list: item },
        })
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((err) => {
            res.status(501).json({
              error: "Something went wrong",
              message: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(503).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.get("/watchlist", isLoggedIn, (req, res) => {
  const { loggedInUser } = req.session;
  UserModel.findById(loggedInUser)
    .then((user) => {
      let watchlist = user.list.filter((media) => {
        return media.listType == "watchlist";
      });
      res.status(200).json(watchlist);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.delete("/user", isLoggedIn, (req, res) => {
  const { loggedInUser } = req.session;
  UserModel.findByIdAndDelete(loggedInUser)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.patch("/update/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { listType } = req.body;
  const { loggedInUser } = req.session;

  UserModel.findByIdAndUpdate(
    loggedInUser,
    {
      $set: { "list.$[element].listType": listType },
    },
    { arrayFilters: [{ "element.mediaId": id }] }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
