const { Job, Contract, Profile, sequelize } = require("../models/model");
const Sequelize = require("sequelize");

const getUnpaidJobsService = async (profileId, options = {}) => {
  try {
    return await Job.findAll({
      where: { [Sequelize.Op.or]: [{ paid: false }, { paid: null }] },
      include: [
        {
          model: Contract,
          where: {
            status: "in_progress",
            [Sequelize.Op.or]: [
              { ClientId: profileId },
              { ContractorId: profileId },
            ],
          },
        },
      ],
      transaction: options.transaction,
    });

    //the transaction will be committed by a higher level function
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

const getTotalUnpaidJobs = async (profileId, options = {}) => {
  const jobs = await getUnpaidJobsService(profileId, {
    transaction: options.transaction,
  });
  const totalUnpaidJobs = jobs.reduce((total, job) => total + job.price, 0);
  // console.log("totalUnpaidJobs: ", totalUnpaidJobs);
  return totalUnpaidJobs;
};

const getAllJobsService = async (profileId, options = {}) => {
  try {
    return await Job.findAll({
      where: {},
      include: [
        {
          model: Contract,
          where: {
            [Sequelize.Op.or]: [
              { ClientId: profileId },
              { ContractorId: profileId },
            ],
          },
        },
      ],
      transaction: options.transaction,
    });
    //the transaction will be committed by a higher level function
  } catch (error) {
    // console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

const payForJobService = async (jobId, clientId) => {
  // in order to balance btw performance and data integrity, we will use REPEATABLE_READ isolation level, because we are reading and writing from single role.
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  try {
    const job = await Job.findOne({
      where: { id: jobId },
      include: {
        model: Contract,
        where: { ClientId: clientId },
      },
    });

    if (!job) {
      await transaction.rollback();
      return { error: "Job not found or you're not the client for this job" };
    }
    //TODO: move the sanity check to a different service, this will make the code cleaner.

    //Some Serious Sanity Checks

    //check if job has already been paid for
    if (job.paid) {
      await transaction.rollback();
      return { error: "Job has already been paid for" };
    }
    //make sure the amount that is being paid is not 0 (assuming we don't use 0 job price to determine free services.)
    if (parseFloat(job.price) === 0) {
      await transaction.rollback();
      return { error: "Amount to be paid is 0: Amount to be paid cannot be 0" };
    }
    //make sure the price of the job is set and not undefined
    if (!job.price) {
      await transaction.rollback();
      return { error: "Price of the job is not set or is Undefined" };
    }

    const client = await Profile.findOne({ where: { id: clientId } });
    const contractor = await Profile.findOne({
      where: { id: job.Contract.ContractorId },
    });

    if (!client || !contractor) {
      await transaction.rollback();
      return { error: "Client or contractor not found" };
    }

    if (parseFloat(client.balance) < parseFloat(job.price)) {
      await transaction.rollback();
      return { error: "Insufficient balance" };
    }
    // to make sure that all are converted to strings for performing arithmetics
    const contractorBalance = parseFloat(contractor.balance);
    const clientBalance = parseFloat(client.balance);
    client.balance = clientBalance - parseFloat(job.price);
    contractor.balance = contractorBalance + parseFloat(job.price);
    job.paid = true;
    job.paymentDate = Date.now();

    await Promise.all([
      client.save({ transaction }),
      contractor.save({ transaction }),
      job.save({ transaction }),
    ]);

    await transaction.commit();
    return { data: job, success: true, date: job.paymentDate };
  } catch (error) {
    await transaction.rollback();
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getUnpaidJobsService,
  payForJobService,
  getAllJobsService,
  getTotalUnpaidJobs,
};
