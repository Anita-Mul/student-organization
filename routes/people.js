"use strict";

import express from "express";
import People from "../controller/people.js";
import Check from "../middleWares/check.js";

const router = express.Router();

router.post("/login", People.login);
router.post("/register", People.register);
router.get("/logout", People.logout);
router.get("/info/:people_id", People.getPeopleInfo);
router.post("/update/avatar/:people_id", People.updateAvatar);
router.get("/applyClubLeader", People.applyClubLeader);
router.get("/applyClubUser", People.applyClubUser);
router.get("/applyAdmin", People.applyAdmin);
router.get("/getClubApplyLeader", People.getClubApplyLeader);
router.get("/getClubApplyUser", People.getClubApplyUser);
router.get("/getApplyAdmin", People.getApplyAdmin);
router.get("/addClubLeader", People.addClubLeader);
router.get("/addClubUser", People.addClubUser);
router.get("/addAdmin", People.addAdmin);

export default router;
