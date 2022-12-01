"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: String,
  password: String,
  id: Number,
  create_time: String,
  institute: String,
  phone: String,
  avatar: { type: String, default: "default.jpg" },
});

adminSchema.index({ id: 1 });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
