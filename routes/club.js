"use strict";

import express from "express";
import Club from "../controller/club";

const router = express.Router();

router.get("/club/:club_id", Club.getClub);
router.get("/allClub", Club.getAllClub);
router.post("/addClub", Club.addClub);
router.get("/deleteClub/:club_id", Club.deleteClub);
router.post("/updateClub", Club.updateClub);

export default router;
