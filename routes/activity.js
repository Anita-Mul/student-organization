"use strict";

import express from "express";
import Activity from "../controller/activities";
import Check from "../middlewares/check.js";

const router = express.Router();

router.get("/activity/:activity_id", Activity.getActivityWithActivityId);
router.get("/club/activity/:club_id", Activity.getActivityWithClubId);
router.get("/allActivity", Activity.getAllActivity);
router.post("/addActivity", Check.checkClubLeader, Activity.addActivity);
router.get(
  "/deleteActivity/:activity_id",
  Check.checkClubLeader,
  Activity.deleteActivity
);
router.post("/updateActivity", Check.checkClubLeader, Activity.updateActivity);
router.get(
  "/updateActivityState/:activity_id",
  Check.checkClubLeader,
  Activity.updateActivityState
);

export default router;
