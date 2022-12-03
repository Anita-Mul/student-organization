"use strict";

import express from "express";
import Budget from "../controller/budget";

const router = express.Router();

router.get("/budget/:budget_id", Budget.getBudgetWithBudgetId);
router.get("/club/budget/:club_id", Budget.getBudgetWithClubId);
router.get("/allBudgets", Budget.getAllBudget);
router.post("/addBudget", Budget.addBudget);
router.get("/deleteBudget/:budget_id", Budget.deleteBudget);
router.post("/updateBudget", Budget.updateBudget);
router.get("/updateBudgetState/:budget_id", Budget.updateBudgetState);

export default router;
