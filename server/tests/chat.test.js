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

test("chat endpoints create messages and update shared location", async () => {
  const { user } = await createUser({
    name: "Chat User",
    email: "chat@example.com",
  });
  const token = signTestToken(user);

  const messageResponse = await request(app)
    .post("/api/chat/messages")
    .set("Authorization", `Bearer ${token}`)
    .send({ body: "Need help near Galle Face." })
    .expect(201);

  assert.equal(messageResponse.body.body, "Need help near Galle Face.");
  assert.equal(messageResponse.body.sender.email, "chat@example.com");

  const locationResponse = await request(app)
    .put("/api/chat/location")
    .set("Authorization", `Bearer ${token}`)
    .send({
      isVisible: true,
      latitude: 6.9271,
      longitude: 79.8612,
    })
    .expect(200);

  assert.equal(locationResponse.body.location.isVisible, true);
  assert.equal(locationResponse.body.location.latitude, 6.9271);
  assert.equal(locationResponse.body.location.longitude, 79.8612);

  const membersResponse = await request(app)
    .get("/api/chat/members")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  assert.equal(membersResponse.body.selfLocation.isVisible, true);
  assert.ok(
    membersResponse.body.activeMembers.some((member) => member.email === "chat@example.com"),
  );
});