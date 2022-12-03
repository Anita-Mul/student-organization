"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  create_time: String,
  leader: [String],
  member: [String],
  information: String,
  type: String,
  picture: { type: String, default: "default.jpg" },
  news: [String],
  activities: [String],
  budget: [String],
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
