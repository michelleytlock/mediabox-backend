const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter username"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    list: [
      {
        mediaId: { type: Schema.Types.ObjectId, ref: "Media" },
        apiId: Number,
        listType: String,
        rating: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { username: 1 },
  { unique: [true, "Username already in use, please enter another username"] }
);
userSchema.index(
  { email: 1 },
  { unique: [true, "Email already in use, please enter another email"] }
);

module.exports = model("User", userSchema);
