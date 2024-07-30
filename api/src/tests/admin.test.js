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

describe("Admin API", () => {
  it("should return the profession that earned the most money", async () => {
    const res = await request(app)
      .get("/admin/best-profession?start=2019-01-01&end=2023-01-31")
      .set("admin_id", "1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("profession");
    expect(res.body).toHaveProperty("total_earned");
  });

  it("should return the clients that paid the most", async () => {
    const res = await request(app)
      .get("/admin/best-clients?start=2019-01-01&end=2023-01-31&limit=2")
      .set("admin_id", "1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("fullName");
    expect(res.body[0]).toHaveProperty("paid");
  });
});
