"use strict";

import mongoose from "mongoose";
import { stringify } from "uuid";

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  create_time: { type: Date, default: Date.now },
  leader: { type: [String], default: [] },
  member: { type: [String], default: [] },
  name: String,
  description: String,
  type: String,
  picture: { type: String, default: "img/default.jpg" },
  news: { type: [String], default: [] },
  activities: { type: [String], default: [] },
  budget: { type: [String], default: [] },
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
