"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: String,
  password: String,
  create_time: String,
  institute: String,
  phone: String,
  avatar: { type: String, default: "default.jpg" },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
