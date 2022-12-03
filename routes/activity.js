"use strict";

import express from "express";
import Activity from "../controller/activities";

const router = express.Router();

router.get("/activity/:activity_id", Activity.getActivityWithActivityId);
router.get("/club/activity/:club_id", Activity.getActivityWithClubId);
router.post("/addActivity", Activity.addActivity);
router.get("/deleteActivity/:activity_id", Activity.deleteActivity);
router.post("/updateActivity", Activity.updateActivity);

export default router;
