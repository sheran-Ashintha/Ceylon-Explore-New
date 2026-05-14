process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const assert = require("node:assert/strict");
const test = require("node:test");
const request = require("supertest");
const createApp = require("../app");
const Destination = require("../models/Destination");
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

test("booking endpoints create and cancel a destination booking", async () => {
  const { user } = await createUser({ email: "booking@example.com" });
  const token = signTestToken(user);
  const destination = await Destination.create({
    name: "Test Stay",
    location: "Kandy",
    description: "A test destination",
    price: 100,
    category: "Hotel",
    images: [],
  });

  const createResponse = await request(app)
    .post("/api/bookings")
    .set("Authorization", `Bearer ${token}`)
    .send({
      bookingType: "destination",
      destinationId: destination._id.toString(),
      checkIn: "2026-06-01",
      checkOut: "2026-06-03",
      guests: 2,
    })
    .expect(201);

  assert.equal(createResponse.body.status, "confirmed");
  assert.equal(createResponse.body.totalPrice, 400);

  const cancelResponse = await request(app)
    .patch(`/api/bookings/${createResponse.body._id}/cancel`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  assert.equal(cancelResponse.body.status, "cancelled");
});