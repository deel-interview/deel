const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/model");
const execSync = require("child_process").execSync;

beforeAll(async () => {
  // Run the seed script to seed the database
  execSync("npm run seed");
});

afterAll(async () => {
  await sequelize.close();
});

describe("Job API", () => {
  const headers = { profile_id: 1 }; // Adjust profile_id as needed based on your seed data

  it("should return a list of unpaid jobs for a profile", async () => {
    const res = await request(app).get("/jobs/unpaid").set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((job) => {
      expect(job).toHaveProperty("id");
      expect(job).toHaveProperty("paid", false);
      expect(job.Contract).toHaveProperty("ClientId");
      expect(job.Contract).toHaveProperty("ContractorId");
    });
  }, 30000); // 30 seconds timeout for this test

  it("should successfully pay for a job", async () => {
    const jobId = 1; // Adjust based on your seed data
    const res = await request(app).post(`/jobs/${jobId}/pay`).set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Payment successful");
  }, 30000); // 30 seconds timeout for this test

  it("should return an error if job ID is missing for payment", async () => {
    const res = await request(app)
      .post("/jobs//pay") // Missing job ID
      .set(headers);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Job ID is required");
  }, 30000); // 30 seconds timeout for this test

  it("should return a list of all jobs for a profile", async () => {
    const res = await request(app).get("/jobs").set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((job) => {
      expect(job).toHaveProperty("id");
      expect(job.Contract).toHaveProperty("ClientId");
      expect(job.Contract).toHaveProperty("ContractorId");
    });
  }, 30000); // 30 seconds timeout for this test
});
