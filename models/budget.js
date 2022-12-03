"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  club: String,
  input: Boolean,
  description: String,
  date: { type: Date, default: Date.now },
  money: Number,
  status: Boolean,
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
