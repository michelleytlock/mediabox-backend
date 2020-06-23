const { Schema, model } = require("mongoose");

let mediaSchema = new Schema({
  apiId: {
    type: Number,
    required: true,
  },
  mediatype: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: true
  },
  cast: [{
    type: String,
    required: true
  }],

  // NOT REQUIRED
  // Movies:
  tagline: String,
  releaseData: Date,
  runtime: Number,
  director: String,
  //TV Shows:
  networks: [String],
  firstAirDate: Date,
  lastAirDate: Date,
  numberEps: Number,
  numberSeas: Number,
  createdBy: String
});

module.exports = model("Media", mediaSchema);