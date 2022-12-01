"use strict";

import express from "express";
import Test from "../controller/test/index.js";

const router = express.Router();

router.get("/test", Test.getTestMessage);

export default router;
