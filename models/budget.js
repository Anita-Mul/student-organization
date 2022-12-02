"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  name: String,
  password: String,
  create_time: String,
  institute: String,
  phone: String,
  avatar: { type: String, default: "default.jpg" },
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
