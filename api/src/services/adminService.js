const { Job, Profile, Contract, sequelize } = require("../models/model");

const Sequelize = require("sequelize");
const getBestProfessionService = async (start, end) => {
  //since this is to be used internally, we can sacrifice performance for data integrity, also this contains the read of multiple lines, so there is a possibility of phantom reads
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const result = await Job.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("price")), "total_earned"],
      ],
      where: {
        paid: true,
        paymentDate: {
          [Sequelize.Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: "Contractor",
              attributes: ["profession"],
            },
          ],
        },
      ],
      group: ["Contract->Contractor.profession"],
      order: [[Sequelize.literal("total_earned"), "DESC"]],
      limit: 1,
      transaction,
    });

    await transaction.commit();

    if (!result.length) {
      return null;
    }

    console.log("result[0].total_earned: ", result[0].total_earned);
    return {
      profession: result[0].Contract.Contractor.profession,
      total_earned: result[0].dataValues.total_earned,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching best profession: ", error);
    throw error;
  }
};

const getBestClientsService = async (start, end, limit = 2) => {
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const result = await Job.findAll({
      attributes: [
        "Contract.ClientId",
        [sequelize.fn("sum", sequelize.col("price")), "total_paid"],
      ],
      where: {
        paid: true,
        paymentDate: {
          [Sequelize.Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Contract,
          //   attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [
                "id",
                [
                  sequelize.fn(
                    "concat",
                    sequelize.col("firstName"),
                    " ",
                    sequelize.col("lastName")
                  ),
                  "fullName",
                ],
              ],
            },
          ],
        },
      ],
      group: ["Contract.ClientId"],
      order: [[sequelize.literal("total_paid"), "DESC"]],
      limit: parseInt(limit, 10),
      transaction,
    });

    if (!result.length) {
      return [];
    }

    const jobList = result.map((job) => {
      const contract = job.Contract || {};
      const client = contract.Client || {};

      return {
        id: client.getDataValue("id"),
        fullName: client.getDataValue("fullName"),
        paid: job.getDataValue("total_paid"),
      };
    });

    await transaction.commit();

    return jobList;
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching best clients: ", error);
    throw error;
  }
};

module.exports = { getBestProfessionService, getBestClientsService };
