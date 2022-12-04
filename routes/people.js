"use strict";

import express from "express";
import People from "../controller/people.js";

const router = express.Router();

router.post("/login", People.login);
router.post("/register", People.register);
router.get("/logout", People.logout);
router.get("/all", People.getAllPeopleWithType);
router.get("/info", People.getPeopleInfo);
router.post("/update/avatar/:people_id", People.updateAvatar);
router.get("/addClubLeader", People.addClubLeader);

export default router;
