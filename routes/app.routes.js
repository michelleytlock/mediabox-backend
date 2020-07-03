const express = require("express");
const router = express.Router();
const axios = require("axios");

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn
const UserModel = require("../models/User.model");
let MediaModel = require("../models/Media.model");
const Mongoose = require("mongoose");


router.post("/create", isLoggedIn, (req, res) => {
  // console.log(req.body);

  // all the info from the buttons:
  const {
    mediaType,
    apiId,
    listType,
    rating,
    description,
    title,
    image,
    genres
  } = req.body;

  // console.log(apiId);

  // deconstruct user from session
  const { loggedInUser } = req.session;

  // check if media exists in media model yet
  MediaModel.find({ apiId })
    .then((media) => {
      // console.log(media);
      // console.log(media.length);

      // if it media doesn't exist in media model, then add it:
      if (media.length == 0) {
        MediaModel.create({
          apiId,
          mediaType,
          title,
          description,
          image, genres
        })
          .then((createdMedia) => {
            // console.log(createdMedia)
            let item = {
              mediaId: createdMedia._id,
              mediaType,
              apiId,
              listType,
              rating,
            };
            //find if item is in usermodel already:
            UserModel.findById(loggedInUser).then((user) => {
              // if it does exist in user model, then update:
              if (
                user.list.some((e) => {
                  return e.apiId === apiId;
                })
              ) {
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
                    UserModel.findById(loggedInUser)
                      .then((user_response) => {
                        console.log('Create user res', user_response, rating)
                        res.status(200).json(user_response)
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
              // if it doesn't exist in user model, then add
              else {
                UserModel.findByIdAndUpdate(loggedInUser, {
                  $push: { list: item },
                })
                  .then((response) => {
                    // console.log('usermodel' + response)
                    UserModel.findById(loggedInUser)
                      .then((user_response) => {
                        res.status(200).json(user_response)
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
      } //if media does exist in media model, then skip adding to media model and just add/update to user
      else {
        let item = {
          mediaId: media[0]._id,
          mediaType,
          apiId,
          listType,
          rating,
        };
        //find if item is in usermodel already:
        UserModel.findById(loggedInUser).then((user) => {
          // if it does exist in user model, then update:
          if (
            user.list.some((e) => {
              return e.apiId === apiId;
            })
          ) {
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
                
                UserModel.findById(loggedInUser)
                  .then((user_response) => {
                    console.log('create else', user_response, rating)
                        res.status(200).json(user_response)
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
          // if it doesn't exist in user model, then add
          else {
            UserModel.findByIdAndUpdate(loggedInUser, {
              $push: { list: item },
            })
              .then((response) => {
                // console.log('usermodel' + response)

                UserModel.findById(loggedInUser)
                  .then((user_response) => {
                    console.log('create else too', user_response, listType)
                        res.status(200).json(user_response)
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

router.get("/watchlist", isLoggedIn, (req, res) => {
  const { loggedInUser } = req.session;
  UserModel.findById(loggedInUser)
    .populate("list.mediaId")
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

router.get("/getDetails/:mediaType/:id", isLoggedIn, (req, res) => {
  const { mediaType, id } = req.params;
  axios
    .get(
      `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
    .then((media) => {
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        )
        .then((credits) => {
          let obj = {
            media: media.data, credits: credits.data
          }
          res.status(200).json(obj);
        });
    });
});

router.get("/:mediaType/:query/searchresults", isLoggedIn, (req, res) => {
  const { mediaType, query } = req.params;
  axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`)
    .then((response) => {
      res.status(200).json(response.data.results)
    })
})

router.get("/getGenres", isLoggedIn, (req, res) => {
  axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
    .then((movieResponse) => {
      axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
        .then((tvResponse) => {
          let genres = {
            movie: movieResponse.data,
            tv: tvResponse.data
          }
          res.status(200).json(genres)
        })
    })
})

router.delete("/user", isLoggedIn, (req, res) => {
  const { loggedInUser } = req.session;
  
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

router.patch("/editProfile", isLoggedIn, (req, res) => {
  const { profileImg } = req.body
  const { loggedInUser } = req.session
  console.log(profileImg)

  UserModel.findByIdAndUpdate(loggedInUser, { profileImg: profileImg })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      })
    });
})

module.exports = router;