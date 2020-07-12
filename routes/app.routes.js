const express = require("express");
const router = express.Router();
const axios = require("axios");

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn
const UserModel = require("../models/User.model");
let MediaModel = require("../models/Media.model");
const Mongoose = require("mongoose");

// This route is called everytime the user rates, saves, skips medias, or the listType changes
router.post("/create", isLoggedIn, (req, res) => {
  // All the info from the buttons transferred over with req.body
  const {
    mediaType,
    apiId,
    listType,
    rating,
    description,
    title,
    image,
    genres,
  } = req.body;

  // Deconstruct user from session
  const { loggedInUser } = req.session;

  // Check if media exists in media model yet
  MediaModel.find({ apiId })
    .then((media) => {
      // If media DOEST'T EXIST in media model, then add it:
      if (media.length == 0) {
        MediaModel.create({
          apiId,
          mediaType,
          title,
          description,
          image,
          genres,
        })
          .then((createdMedia) => {
            let item = {
              mediaId: createdMedia._id,
              mediaType,
              apiId,
              listType,
              rating,
            };
            // Must check out User Model List by searching for correct user:
            UserModel.findById(loggedInUser).then((user) => {
              // Find if item is in User Model List already:
              if (
                user.list.some((e) => {
                  return e.apiId === apiId;
                })
              ) {
                // If it DOES EXIST in user model, then update the listType (rated, watchlist, or skip):
                UserModel.findByIdAndUpdate(
                  loggedInUser,
                  {
                    $set: {
                      "list.$[element].listType": listType,
                      "list.$[element].rating": rating,
                    },
                  },
                  { arrayFilters: [{ "element.mediaId": id }] }
                )
                  .then((response) => {
                    // findByIdAndUpdate doesn't return the updated user, response will not equal the updated user, so have to find:
                    UserModel.findById(loggedInUser)
                      .then((user_response) => {
                        res.status(200).json(user_response);
                      })
                      .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                          error: "Something went wrong",
                          message: err,
                        });
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: "Something went wrong",
                      message: err,
                    });
                  });
              }
              // If it DOESN'T EXIST in user model, then add it:
              else {
                // Push item object from Line 41 into the user's list
                UserModel.findByIdAndUpdate(loggedInUser, {
                  $push: { list: item },
                })
                  .then((response) => {
                    // findByIdAndUpdate doesn't return the updated user, response will not equal the updated user, so have to find:
                    UserModel.findById(loggedInUser)
                      .then((user_response) => {
                        res.status(200).json(user_response);
                      })
                      .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                          error: "Something went wrong",
                          message: err,
                        });
                      });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      error: "Something went wrong",
                      message: err,
                    });
                  });
              }
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: "Something went wrong",
              message: err,
            });
          });
      } // If media DOES EXIST in media model, then skip adding it to media model and just add/update to user model:
      else {
        let item = {
          mediaId: media[0]._id,
          mediaType,
          apiId,
          listType,
          rating,
        };
        // Must check out User Model List by searching for correct user:
        UserModel.findById(loggedInUser).then((user) => {
          // Find if item is in User Model List already:
          if (
            user.list.some((e) => {
              return e.apiId === apiId;
            })
          ) {
            // If it DOES EXIST in user model, then update:
            UserModel.findByIdAndUpdate(
              loggedInUser,
              {
                $set: {
                  "list.$[element].listType": listType,
                  "list.$[element].rating": rating,
                },
              },
              { arrayFilters: [{ "element.mediaId": media[0]._id }] }
            )
              .then((response) => {
                // findByIdAndUpdate doesn't return the updated user, response will not equal the updated user, so have to find:
                UserModel.findById(loggedInUser)
                  .then((user_response) => {
                    res.status(200).json(user_response);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: "Something went wrong",
                      message: err,
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: "Something went wrong",
                  message: err,
                });
              });
          }
          // If it DOESN'T EXIST in user model, then add
          else {
            // Push item object from Line 126 into the user's list
            UserModel.findByIdAndUpdate(loggedInUser, {
              $push: { list: item },
            })
              .then((response) => {
                // findByIdAndUpdate doesn't return the updated user, response will not equal the updated user, so have to find:
                UserModel.findById(loggedInUser)
                  .then((user_response) => {
                    res.status(200).json(user_response);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: "Something went wrong",
                      message: err,
                    });
                  });
              })
              .catch((err) => {
                res.status(500).json({
                  error: "Something went wrong",
                  message: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// This route is called to get the user's watchlist aka search through user's list for listType === "watchlist"
router.get("/watchlist", isLoggedIn, (req, res) => {
  // Get user's id from the session
  const { loggedInUser } = req.session;
  UserModel.findById(loggedInUser)
    // Use .populate to get the media's info from the Media Model through the reference ID to access details about the movie/tv show
    .populate("list.mediaId")
    .then((user) => {
      // User is the user object that will have a List array
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

//This route is called when the user clicks on a movie/tv show that will render a details page. In this route, two calls are made to the external API in order to get 1) the details about the movie/tv show as well as 2) the relevant credits info
router.get("/getDetails/:mediaType/:id", isLoggedIn, (req, res) => {
  // Receive the mediaType and media's apiId from params
  const { mediaType, id } = req.params;

  // First external API call for media details
  axios
    .get(
      `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
    .then((media) => {
      // Second external API call for media credits
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        )
        .then((credits) => {
          // Combine all info into one object to send back to client
          let obj = {
            media: media.data,
            credits: credits.data,
          };
          res.status(200).json(obj);
        });
    });
});

// This route is called when the user searches for a movie/tv show/person. In this route, a call to the external API is made to get the search results.
router.get("/:query/searchresults", isLoggedIn, (req, res) => {
  // Search query is transferred with params
  const { query } = req.params;
  // Call to external API, using their search method, that allows for queries ranging from movie titles, tv show names, and people (actors, actresses, directors, etc)
  axios
    .get(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`
    )
    .then((response) => {
      res.status(200).json(response.data.results);
    });
});

// This route is for getting all the genres from the external API
router.get("/getGenres", isLoggedIn, (req, res) => {
  // Get all movie genres
  axios
    .get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
    .then((movieResponse) => {
      // Get all tv genres
      axios
        .get(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        )
        .then((tvResponse) => {
          // Send all genres in an object
          let genres = {
            movie: movieResponse.data,
            tv: tvResponse.data,
          };
          res.status(200).json(genres);
        });
    });
});

// This route deletes the user from the User Model
router.delete("/user", isLoggedIn, (req, res) => {
  const { loggedInUser } = req.session;

  // Find user by id and delete it, as well as destroy session
  UserModel.findByIdAndDelete(loggedInUser)
    .then((response) => {
      req.session.destroy();
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// router.patch("/update/:id", isLoggedIn, (req, res) => {
//   const { id } = req.params;
//   const { listType } = req.body;
//   const { loggedInUser } = req.session;

//   UserModel.findByIdAndUpdate(
//     loggedInUser,
//     {
//       $set: { "list.$[element].listType": listType },
//     },
//     { arrayFilters: [{ "element.mediaId": id }] }
//   )
//     .then((response) => {
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: "Something went wrong",
//         message: err,
//       });
//     });
// });

// This route updates user's profile info (mainly used for profile image upload)
router.patch("/editProfile", isLoggedIn, (req, res) => {
  // profileImg cloudinary link from req.body
  const { profileImg } = req.body;
  const { loggedInUser } = req.session;

  UserModel.findByIdAndUpdate(loggedInUser, { profileImg: profileImg })
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