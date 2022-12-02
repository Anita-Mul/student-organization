"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  club: Number,
  title: String,
  content: String,
  picture: { type: String, default: "default.jpg" },
});

const News = mongoose.model("News", newsSchema);

export default News;
