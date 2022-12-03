"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: String,
  site: String,
  time: String,
  number: Number,
  leader: String,
  state: Boolean,
  club: String,
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
