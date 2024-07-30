const { depositMoneyService } = require("../services/balanceService");
const { getAllProfileService } = require("../services/usersService");
const { sequelize } = require("../models/model");
const Sequelize = require("sequelize");
//TODO: Do Validations on every request to all the controllers
//TODO: Sanitize call inputs

const depositMoney = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const { amount } = req.body;
  const profile = req.profile.dataValues;
  //make sure that the authenticated user is the one passing calling the function, that is userId must be equall to profile.id
  //the requirement did not explicitly say anything about the possibility of a client depositing for another clients, so yea.
  if (userId.toString() !== profile.id.toString()) {
    console.log("profile.id: ", profile.id);
    console.log("userId: ", userId);
    return res.status(401).json({
      message: "Unauthorized: You cannot deposit for another client.",
    });
  }

  if (profile.type !== "client") {
    return res.status(401).json({
      message: "This Endpoint Requires you to be a client to Deposit",
    });
  }

  //let use quickly do some validation here
  // since the this endpoint is for clients depositing money, we should make sure the person making the request is not a contractor,
  //if contractors are also meant to deposit, we will handle that separately, since the requirement did not state that, we will just assume that this is for clients only.

  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ message: "Invalid deposit amount" });
  }

  try {
    //transactions are handled inside the service
    const newBalance = await depositMoneyService(userId, amount);
    res.json({ message: "Deposit successful", balance: newBalance });
  } catch (error) {
    console.error("Error depositing money: ", error);
    res.status(500).json({ message: error.message });
  }
};

const getProfiles = async (req, res) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const profiles = await getAllProfileService({ transaction });
    // console.log("profiles: ", profiles);
    if (!profiles.length) {
      await transaction.commit();
      return res.status(404).json({ message: "No unpaid profiles found" });
    }
    await transaction.commit();
    res.json(profiles);
  } catch (error) {
    console.error("error: ", error);
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { depositMoney, getProfiles };
