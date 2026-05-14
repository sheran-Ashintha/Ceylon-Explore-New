process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const assert = require("node:assert/strict");
const test = require("node:test");
const request = require("supertest");
const createApp = require("../app");
const {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
} = require("./testUtils");

const app = createApp();

test.before(async () => {
  await startTestDatabase();
});

test.after(async () => {
  await stopTestDatabase();
});

test.beforeEach(async () => {
  await clearTestDatabase();
});

test("POST /api/auth/register creates a user and returns a token", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Traveler",
      email: "traveler@example.com",
      password: "password123",
    })
    .expect(201);

  assert.ok(response.body.token);
  assert.equal(response.body.user.name, "Traveler");
  assert.equal(response.body.user.email, "traveler@example.com");
  assert.equal(response.body.user.role, "user");
});

test("POST /api/auth/login rejects an invalid password", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Traveler",
      email: "traveler@example.com",
      password: "password123",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "traveler@example.com",
      password: "wrong-password",
    })
    .expect(400);

  assert.match(response.body.message, /invalid email or password/i);
});