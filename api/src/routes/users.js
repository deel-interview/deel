const express = require("express");
const { depositMoney, getProfiles } = require("../controllers/usersController");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
router.use(getProfile);

router.post("/deposit/:userId", depositMoney);
router.get("/profiles", getProfiles);

module.exports = router;
