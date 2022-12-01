"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const leaderSchema = new Schema({
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

leaderSchema.index({ id: 1 });

const Leader = mongoose.model("Leader", leaderSchema);

export default Leader;
