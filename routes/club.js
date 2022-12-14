"use strict";

import express from "express";
import Club from "../controller/club";
import Check from "../middleWares/check.js";

const router = express.Router();

router.get("/club/:club_id", Club.getClub);
router.get("/allClub", Club.getAllClub);
router.post("/addClub", Check.checkAdmin, Club.addClub);
router.get("/deleteClub/:club_id", Check.checkAdmin, Club.deleteClub);
router.post("/updateClub", Check.checkClubLeader, Club.updateClub);

export default router;
