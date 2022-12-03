"use strict";

import express from "express";
import News from "../controller/news.js";

const router = express.Router();

router.get("/news/:news_id", News.getNewsWithNewsId);
router.get("/club/news/:club_id", News.getNewsWithClubId);
router.post("/addNews", News.addNews);
router.get("/deleteNews/:news_id", News.deleteNews);
router.post("/updateNews", News.updateNews);

export default router;