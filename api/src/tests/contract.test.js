const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/model");
const execSync = require("child_process").execSync;

beforeAll(async () => {
  // Run the seed script to seed the database
});

afterAll(async () => {
  await sequelize.close();
});

describe("Contract API", () => {
  const headers = { profile_id: 1 }; // Adjust profile_id as needed

  it("should return a list of contracts for a profile", async () => {
    const res = await request(app).get("/contracts").set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((contract) => {
      expect(contract).toHaveProperty("id");
      expect(contract).toHaveProperty("ClientId");
      expect(contract).toHaveProperty("ContractorId");
      expect(contract.status).not.toBe("terminated");
    });
  }, 30000); // 30 seconds timeout for this test

  it("should return a specific contract if it belongs to the profile", async () => {
    const contractId = 1; // Adjust based on your seed data
    const res = await request(app).get(`/contracts/${contractId}`).set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", contractId);
    expect(res.body).toHaveProperty("ClientId");
    expect(res.body).toHaveProperty("ContractorId");
  }, 30000); // 30 seconds timeout for this test

  it("should return 404 if the contract does not belong to the profile", async () => {
    const contractId = 9999; // Use a contract ID that doesn't exist or doesn't belong to the profile
    const res = await request(app).get(`/contracts/${contractId}`).set(headers);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      "message",
      "NOT FOUND : Could not find the contract or the contract does not belong to this profile"
    );
  }, 30000);
});
