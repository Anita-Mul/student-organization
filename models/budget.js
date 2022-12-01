"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  name: String,
  password: String,
  id: Number,
  create_time: String,
  institute: String,
  phone: String,
  avatar: { type: String, default: "default.jpg" },
});

budgetSchema.index({ id: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
