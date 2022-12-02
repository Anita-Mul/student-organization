"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  create_time: String,
  leader: [Number],
  member: [Number],
  information: String,
  type: String,
  picture: { type: String, default: "default.jpg" },
  news: [Number],
  activities: [Number],
  budget: [Number],
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
