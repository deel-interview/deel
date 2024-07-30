const express = require("express");
const {
  getUnpaidJobs,
  payForJob,
  getAllJobs,
} = require("../controllers/jobsController");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
router.use(getProfile);

router.get("/all-jobs", getAllJobs);
router.get("/unpaid", getUnpaidJobs);
router.post("/:job_id/pay", payForJob);

module.exports = router;
