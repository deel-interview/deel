const express = require("express");
const contractsRouter = require("./contracts");
const jobsRouter = require("./jobs");
const adminRouter = require("./admin");
const balancesRouter = require("./users");

const router = express.Router();

router.use("/contracts", contractsRouter);
router.use("/jobs", jobsRouter);
router.use("/users", balancesRouter);
router.use("/admin", adminRouter);

module.exports = router;
