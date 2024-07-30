const {
  getUnpaidJobsService,
  payForJobService,
  getAllJobsService,
} = require("../services/jobService");

const { sequelize } = require("../models/model");

const Sequelize = require("sequelize");

const getUnpaidJobs = async (req, res) => {
  const { id: profileId } = req.profile.dataValues;

  if (!profileId) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  // transaction isolation is SERIALIZABLE because we are going to be reading multiple rows that might we updated by another query.
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const jobs = await getUnpaidJobsService(profileId, { transaction });
    // console.log("jobs: ", jobs);
    if (!jobs.length) {
      await transaction.commit();
      return res.status(404).json({ message: "No unpaid jobs found" });
    }
    await transaction.commit();
    res.json(jobs);
  } catch (error) {
    console.error("error: ", error);
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

const payForJob = async (req, res) => {
  const { job_id: jobId } = req.params;
  const { id: clientId } = req.profile.dataValues;

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required" });
  }

  try {
    //transactions are handled inside the service
    const result = await payForJobService(jobId, clientId);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    res.json({ message: "Payment successful" });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ message: error.message });
  }
};
const getAllJobs = async (req, res) => {
  const { id: profileId } = req.profile.dataValues;

  if (!profileId) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // sequelize transaction
  // since this is reading a series of entries from the database, we need to prevent phantom reads
  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const jobs = await getAllJobsService(profileId);
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No  jobs found" });
    }

    await transaction.commit();
    res.json(jobs);
  } catch (error) {
    await transaction.rollback();
    console.error("error: ", error);
    res.status(500).json({ message: error.message });
  }
  const jobs = await getAllJobsService(profileId);
};

module.exports = { getUnpaidJobs, payForJob, getAllJobs };
