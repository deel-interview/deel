const { sequelize, Profile } = require("../models/model");
const { getUnpaidJobsService } = require("./jobService");
const Sequelize = require("sequelize");

const depositMoneyService = async (userId, amount) => {
  // Calculate the total unpaid jobs for the client
  // the isolation level REPEATABLE_READ is best here since it prevent dirty and non-repeatable read, we do not need to check for phatom reads here since we are only modifying on entry in a table.
  // this is more performance since SERIALIZABLE would have been an overkill
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  let jobs;
  try {
    try {
      jobs = await getUnpaidJobsService(userId, { transaction });
    } catch (error) {
      await transaction.rollback();
      console.log("error: ", error);
      throw new Error("Error: error getting Unpaid Jobs");
    }

    const totalUnpaidJobs = jobs.reduce((total, job) => total + job.price, 0);
    console.log("totalUnpaidJobs: ", totalUnpaidJobs);
    const maxDeposit = totalUnpaidJobs * 0.25;
    //handle for then they do not have any unpaid jobs,typically the UI will not allow them make this request of they don't have Unpaid jobs

    if (totalUnpaidJobs <= 0) {
      throw new Error("No unpaid jobs found. Cannot deposit money.");
    }

    if (parseFloat(amount) > maxDeposit) {
      throw new Error(
        `Deposit cannot exceed 25% of total unpaid jobs: ${maxDeposit}`
      );
    }

    // Find the client's profile and update balance
    const client = await Profile.findOne({
      where: { id: userId },
      transaction,
    });
    if (!client) {
      throw new Error("Client not found");
    }
    const currentBalance = parseFloat(client.balance);
    const depositAmount = parseFloat(amount);

    client.balance = currentBalance + depositAmount;
    console.log("client.balance: ", typeof currentBalance);
    console.log("amount: ", depositAmount);
    //check if amount is a number

    await client.save({ transaction });
    await transaction.commit();
    return client.balance;
  } catch (error) {
    console.log("error: ", error);
    await transaction.rollback();
    throw error;
  }
};

module.exports = { depositMoneyService };
