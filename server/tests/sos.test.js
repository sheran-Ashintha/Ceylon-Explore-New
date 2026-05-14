process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const assert = require("node:assert/strict");
const test = require("node:test");
const request = require("supertest");
const createApp = require("../app");
const {
  clearTestDatabase,
  createUser,
  signTestToken,
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

test("GET /api/sos returns seeded SOS content", async () => {
  const response = await request(app)
    .get("/api/sos")
    .expect(200);

  assert.equal(response.body.contacts.length, 5);
  assert.equal(response.body.scenarios.length, 5);
  assert.equal(response.body.reasons.length, 5);
  assert.equal(response.body.prepSteps.length, 4);
  assert.equal(response.body.sources.length, 5);
});

test("PUT /api/sos updates SOS content for admins", async () => {
  const { user } = await createUser({
    email: "admin@example.com",
    role: "admin",
  });
  const token = signTestToken(user);

  const updateResponse = await request(app)
    .put("/api/sos")
    .set("Authorization", `Bearer ${token}`)
    .send({
      reasons: ["Medical emergencies", "Embassy support"],
    })
    .expect(200);

  assert.deepEqual(updateResponse.body.reasons, ["Medical emergencies", "Embassy support"]);

  const followUpResponse = await request(app)
    .get("/api/sos")
    .expect(200);

  assert.deepEqual(followUpResponse.body.reasons, ["Medical emergencies", "Embassy support"]);
});

test("unknown API routes return JSON 404 responses", async () => {
  const response = await request(app)
    .get("/api/does-not-exist")
    .expect(404);

  assert.match(response.body.message, /route not found/i);
});