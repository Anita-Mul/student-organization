"use strict";

import express from "express";
import People from "../controller/people.js";
import check from "../middleWares/check.js";

const router = express.Router();

router.post("/login", People.login);
router.post("/register", People.register);
router.get("/logout", People.logout);
router.get("/all", People.getAllPeopleWithType);
router.get("/info/:people_id", People.getPeopleInfo);
router.post("/update/avatar/:people_id", People.updateAvatar);
router.get("/addClubLeader/:people_id", People.addClubLeader);
router.get("/addClubUser/:people_id", People.addClubUser);
router.get("/addAdmin/:people_id", People.addAdmin);

export default router;
