"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: String,
  password: String,
  id: Number,
  create_time: String,
  sex: { type: String, default: "man" },
  institute: String,
  phone: String,
  club: [Number],
  avatar: { type: String, default: "default.jpg" },
});

userSchema.index({ id: 1 });

const User = mongoose.model("User", userSchema);

export default User;
