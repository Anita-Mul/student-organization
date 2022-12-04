"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const peopleSchema = new Schema({
  user_name: String,
  password: String,
  create_time: String,
  sex: { type: String, default: "man" },
  institute: String,
  phone: String,
  manageClub: { type: [String], default: [] },
  club: { type: [String], default: [] },
  avatar: { type: String, default: "img/default.jpg" },
  type: "String",
});

const People = mongoose.model("People", peopleSchema);

export default People;
