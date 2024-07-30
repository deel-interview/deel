const {
  findAllContract,
  findContractById,
} = require("../services/contractService");

const { sequelize } = require("../models/model");
const Sequelize = require("sequelize");

const getContracts = async (req, res) => {
  const { id } = req.profile.dataValues;
  console.log("id: ", id);

  if (!id) {
    return res.status(401).json({ message: "authentication failed" });
  }
  let result;

  // transaction isolation is SERIALIZABLE because we are going to be reading multiple rows that might we updated by another query.
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });
  try {
    result = await findAllContract(id, { transaction });
    await transaction.commit();
  } catch (error) {
    console.log("error: ", error);
    await transaction.rollback();
    return res.status(501).json({ message: "somthing went wrong" });
  }

  if (!result) {
    await transaction.commit();
    return res.status(501).json({ message: "Something went Wrong" });
  }
  res.json(result);
};

const getContractById = async (req, res) => {
  if (!req.params) {
    return res
      .status(401)
      .json({ message: "You have to pass in a contract ID" });
  }
  const { id } = req.params;
  const profile = req.profile.dataValues;
  let result;
  //since we will be reading from one field
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  try {
    result = await findContractById(id, profile.id, { transaction });
    console.log("ttttt");
    console.log(result);
    await transaction.commit();
  } catch (error) {
    console.log("error: ", error);
    await transaction.rollback();
    return res.status(401).json({ message: error.message });
  }
  if (!result) {
    await transaction.commit();
    return res.status(404).json({ message: "NOT FOUND " });
  }
  res.json(result);
};

module.exports = { getContractById, getContracts };
