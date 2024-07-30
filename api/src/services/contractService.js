const { Contract, Profile, Job, sequelize } = require("../models/model");
const Sequelize = require("sequelize");

const findContractById = async (id, profileId, options = {}) => {
  const result = await Contract.findOne({
    where: {
      id,
      [Sequelize.Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
    },
    include: [
      {
        model: Profile,
        as: "Client",
        attributes: ["id", "lastName", "firstName"],
      },
      {
        model: Profile,
        as: "Contractor",
        attributes: ["id", "lastName", "firstName"],
      },
      {
        model: Job,
        as: "Jobs",
      },
    ],
    transaction: options.transaction,
  });

  if (!result) {
    throw new Error(
      "NOT FOUND : Could not find the contract or the contract does not belong to this profile"
    );
  }
  return result;
};

const findAllContract = async (profileId, options = {}) => {
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
          model: Profile,
          as: "Client",
          attributes: ["id", "lastName", "firstName"],
        },
        {
          model: Profile,
          as: "Contractor",
          attributes: ["id", "lastName", "firstName"],
        },
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
