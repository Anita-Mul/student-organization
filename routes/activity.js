"use strict";

import express from "express";
import Activity from "../controller/activities";
import check from "../middleWares/check.js";

const router = express.Router();

router.get("/activity/:activity_id", Activity.getActivityWithActivityId);
router.get("/club/activity/:club_id", Activity.getActivityWithClubId);
router.get("/allActivity", Activity.getAllActivity);
router.post("/addActivity", Activity.addActivity);
router.get("/deleteActivity/:activity_id", Activity.deleteActivity);
router.post("/updateActivity", Activity.updateActivity);
router.get("/updateActivityState/:activity_id", Activity.updateActivityState);

export default router;
