const express = require("express");
const {
  depositMoney,
  getProfiles,
  getSingleProfiles,
} = require("../controllers/usersController");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
router.use(getProfile);

router.post("/deposit/:userId", depositMoney);
router.get("/profiles", getProfiles);
router.get("/profile", getSingleProfiles);

module.exports = router;
