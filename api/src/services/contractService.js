const { Contract, Profile, Job } = require("../models/model");
const Sequelize = require("sequelize");

const findContractById = async (id, profileId, options = {}) => {
  console.log("profileIdcc: ", profileId);

  const result = await Contract.findOne({
    where: {
      id,
      [Sequelize.Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
    },
    include: { model: Job },
    transaction: options.transaction,
  });
  console.log(result);
  if (!result) {
    throw new Error(
      "Could not find the contract or the contract does not belong to this profile"
    );
  }
  return result;
};

const findAllContract = async (profileId, options = {}) => {
  console.log("profileId: ", profileId);
  try {
    const result = await Contract.findAll({
      where: {
        [Sequelize.Op.not]: [{ status: "terminated" }],
        [Sequelize.Op.or]: [
          { clientId: profileId },
          { contractorId: profileId },
        ],
      },
      include: [
        {
          model: Job,
          as: "Jobs",
        },
      ],
      transaction: options.transaction,
    });
    return result;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

module.exports = { findContractById, findAllContract };
