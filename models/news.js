"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  id: Number,
  club: Number,
  title: String,
  content: String,
  picture: { type: String, default: "default.jpg" },
});

newsSchema.index({ id: 1 });

const News = mongoose.model("News", newsSchema);

export default News;
