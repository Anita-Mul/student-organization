"use strict";

import express from "express";
import People from "../controller/people.js";
import Check from "../middlewares/check.js";

const router = express.Router();

router.post("/login", People.login);
router.post("/register", People.register);
router.get("/logout", People.logout);
router.get("/info/:people_id", People.getPeopleInfo);
router.post("/update/avatar/:people_id", People.updateAvatar);
router.get("/applyClubLeader", People.applyClubLeader);
router.get("/applyClubUser", People.applyClubUser);
router.get("/applyAdmin", People.applyAdmin);
router.get(
  "/getClubApplyLeader",
  Check.checkClubLeader,
  People.getClubApplyLeader
);
router.get("/getClubApplyUser", Check.checkClubLeader, People.getClubApplyUser);
router.get("/getApplyAdmin", Check.checkAdmin, People.getApplyAdmin);
router.get("/addClubLeader", Check.checkClubLeader, People.addClubLeader);
router.get("/addClubUser", Check.checkClubLeader, People.addClubUser);
router.get("/addAdmin", Check.checkAdmin, People.addAdmin);

export default router;
