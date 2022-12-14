"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const applyAdmin = new Schema({
  applyAdminPeople: { type: [String], default: [] },
});

const ApplyAdmin = mongoose.model("ApplyAdmin", applyAdmin);

export default ApplyAdmin;
