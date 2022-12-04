"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  create_time: String,
  leader: { type: [String], default: [] },
  member: { type: [String], default: [] },
  information: String,
  type: String,
  picture: { type: String, default: "img/default.jpg" },
  news: { type: [String], default: [] },
  activities: { type: [String], default: [] },
  budget: { type: [String], default: [] },
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
