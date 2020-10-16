const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testHelper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await testHelper.setUpDb();
});

afterAll(() => mongoose.connection.close());

describe("retrieving all users", () => {
  test("should return a list of all users", async () => {
    const usersAtStart = await testHelper.usersInDb();
    const result = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(result.body).toEqual(usersAtStart);
  });
});

describe("creating a new user", () => {
  test("should succeed with a unique username", async () => {
    const usersAtStart = await testHelper.usersInDb();

    await api
      .post("/api/users")
      .send(testHelper.newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(testHelper.newUser.username);
  });

  test("should fail with a non-unique username", async () => {
    await api
      .post("/api/users")
      .send(testHelper.newUserTakenUsername)
      .expect(400);
  });

  test("should fail with a password shorter than three characters", async () => {
    await api
      .post("/api/users")
      .send(testHelper.newUserShortPassword)
      .expect(400);
  });
});

describe("logging in", () => {
  test("should succeed with token with valid credentials", async () => {
    const user = testHelper.initialUsers[0];
    const result = await api
      .post("/api/login")
      .send({ username: user.username, password: user.password })
      .expect(200);

    expect(result.body.token).toBeDefined();
  });

  test("should fail with invalid credentials", async () => {
    await api
      .post("/api/login")
      .send({ username: "baduser", password: "baspass" })
      .expect(401);
  });
});
