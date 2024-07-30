const express = require("express");
const {
  getContractById,
  getContracts,
} = require("../controllers/contractsController");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
router.use(getProfile);

router.get("/:id", getContractById);
router.get("/", getContracts);

module.exports = router;
