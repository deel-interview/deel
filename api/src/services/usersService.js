const { Profile, sequelize } = require("../models/model");
const Sequelize = require("sequelize");

const getAllProfileService = async (options = {}) => {
  try {
    return await Profile.findAll({
      where: {},
      transaction: options.transaction,
    });
    //the transaction will be committed by a higher level function
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

const getProfileService = async (id, options = {}) => {
  try {
    return await Profile.findAll({
      where: { id },
      transaction: options.transaction,
    });
    //the transaction will be committed by a higher level function
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getAllProfileService,
  getProfileService,
};
