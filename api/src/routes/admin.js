const express = require("express");
const {
  getBestProfession,
  getBestClients,
} = require("../controllers/adminController");
const router = express.Router();

const { getAdmin } = require("../middleware/getAdmin");
router.use(getAdmin);

router.get("/best-profession", getBestProfession);
router.get("/best-clients", getBestClients);

module.exports = router;
