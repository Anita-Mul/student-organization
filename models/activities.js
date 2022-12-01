"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activitiesSchema = new Schema({
  name: String,
  password: String,
  id: Number,
  create_time: String,
  institute: String,
  phone: String,
  avatar: { type: String, default: "default.jpg" },
});

activitiesSchema.index({ id: 1 });

const Activities = mongoose.model("Activities", activitiesSchema);

export default Activities;
