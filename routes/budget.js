"use strict";

import express from "express";
import Budget from "../controller/budget";
import Check from "../middlewares/check.js";

const router = express.Router();

router.get("/budget/:budget_id", Budget.getBudgetWithBudgetId);
router.get("/club/budget/:club_id", Budget.getBudgetWithClubId);
router.get("/allBudgets", Budget.getAllBudget);
router.post("/addBudget", Check.checkClubLeader, Budget.addBudget);
router.get(
  "/deleteBudget/:budget_id",
  Check.checkClubLeader,
  Budget.deleteBudget
);
router.post("/updateBudget", Check.checkClubLeader, Budget.updateBudget);
router.get(
  "/updateBudgetState/:budget_id",
  Check.checkClubLeader,
  Budget.updateBudgetState
);

export default router;
