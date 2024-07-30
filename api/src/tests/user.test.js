const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/model");
const execSync = require("child_process").execSync;

beforeAll(async () => {});

afterAll(async () => {
  await sequelize.close();
});

describe("User API", () => {
  const headers = { profile_id: 1 }; // Adjust profile_id as needed based on your seed data

  it("should deposit money for a user", async () => {
    const userId = 1; // Adjust based on your seed data
    const res = await request(app)
      .post(`/users/deposit/${userId}`)
      .set(headers)
      .send({ amount: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Deposit successful");
    expect(res.body).toHaveProperty("balance");
  }, 30000); // 30 seconds timeout for this test

  it("should throw an error for Deposit amount higher than 25% of unpaid jobs", async () => {
    const userId = 1; // Adjust based on your seed data
    const res = await request(app)
      .post(`/users/deposit/${userId}`)
      .set(headers)
      .send({ amount: 100 });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toMatch(
      /Deposit cannot exceed 25% of total unpaid jobs/
    );
  }, 30000); // 30 seconds timeout for this test

  it("should return an error if user ID is missing for deposit", async () => {
    const res = await request(app)
      .post("/users//deposit") // Missing user ID
      .set(headers)
      .send({ amount: 100 });

    expect(res.statusCode).toEqual(404);
  }, 30000); // 30 seconds timeout for this test

  it("should return an error if deposit amount is invalid", async () => {
    const userId = 1; // Adjust based on your seed data
    const res = await request(app)
      .post(`/users/deposit/${userId}`)
      .set(headers)
      .send({ amount: 0 });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid deposit amount");
  }, 30000); // 30 seconds timeout for this test

  it("should return a list of all profiles", async () => {
    const res = await request(app).get("/users/profiles").set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((profile) => {
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("firstName");
      expect(profile).toHaveProperty("lastName");
      expect(profile).toHaveProperty("balance");
    });
  }, 30000); // 30 seconds timeout for this test

  it("should return a single profile", async () => {
    const res = await request(app).get("/users/profile").set(headers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("firstName");
    expect(res.body).toHaveProperty("lastName");
    expect(res.body).toHaveProperty("balance");
  }, 30000); // 30 seconds timeout for this test
});
