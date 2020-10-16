const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testHelper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await testHelper.setUpDb();
});

afterAll(() => mongoose.connection.close());

describe("retrieving blogs", () => {
  test("should return notes as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return all blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(testHelper.initialBlogs.length);
  });

  test("should have the unique identifier of the blogs be called 'id'", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
  test("should include the correct titles for all blogs", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map(b => b.title).sort();
    const titlesToTest = testHelper.initialBlogs.map(b => b.title).sort();

    expect(titles).toEqual(titlesToTest);
  });
});

describe("retrieving a single blog", () => {
  test("should succeed with a valid id", async () => {
    const blogToGet = await testHelper.oneBlogInDb();
    await api
      .get(`/api/blogs/${blogToGet.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return the correct blog", async () => {
    const blogToGet = await testHelper.oneBlogInDb();
    const response = await api.get(`/api/blogs/${blogToGet.id}`);

    expect(response.body.id).toEqual(blogToGet.id);
  });

  test("should fail with an id that does not exist", async () => {
    const badId = await testHelper.nonExistentId();
    await api.get(`/api/blogs/${badId}`).expect(404);
  });

  test("should fail with an invalid id", async () => {
    await api.get("/api/blogs/000").expect(400);
  });
});

describe("adding a new blog", () => {
  let userToken;
  beforeEach(async () => {
    const initUser = testHelper.initialUsers[0];
    const user = await api
      .post("/api/login")
      .send({ username: initUser.username, password: initUser.password });
    userToken = `Bearer ${user.body.token}`;
  });

  test("should increase the number of total blogs by one", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(testHelper.initialBlogs.length);

    await api
      .post("/api/blogs")
      .send(testHelper.newBlog)
      .set("Authorization", userToken);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1);
  });

  test("should include the new blog's content", async () => {
    await api
      .post("/api/blogs")
      .send(testHelper.newBlog)
      .set("Authorization", userToken);

    const blogsAtEnd = await testHelper.blogsInDb();
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain("A New Blog");
  });

  test("should assign a likes value of 0 if likes property is missing", async () => {
    await api
      .post("/api/blogs")
      .send(testHelper.newBlog)
      .set("Authorization", userToken);

    const blogsAtEnd = await testHelper.blogsInDb();
    const addedBlog = blogsAtEnd.find(b => b.title === "A New Blog");
    expect(addedBlog.likes).toBe(0);
  });

  test("should respond with 401 if auth token is missing", async () => {
    await api.post("/api/blogs").send(testHelper.newBlog).expect(401);
  });

  test("should respond with 400 if title or url is missing", async () => {
    await api
      .post("/api/blogs")
      .send(testHelper.newBlogNoTitle)
      .set("Authorization", userToken)
      .expect(400);
    await api
      .post("/api/blogs")
      .send(testHelper.newBlogNoUrl)
      .set("Authorization", userToken)
      .expect(400);
  });
});

describe("deleting a blog", () => {
  let userToken;
  let blogId;
  beforeEach(async () => {
    const blog = await testHelper.makeNewBlog();
    blogId = blog._id;
    const initUser = testHelper.newUser;
    const user = await api
      .post("/api/login")
      .send({ username: initUser.username, password: initUser.password });
    userToken = `Bearer ${user.body.token}`;
  });

  test("should succeed if id is valid", async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", userToken)
      .expect(200);
  });

  test("should return the deleted blog", async () => {
    const response = await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", userToken);

    expect(response.body.id).toBe(blogId.toString());
  });

  test("should fail if id does not exist", async () => {
    const badId = await testHelper.nonExistentId();
    await api
      .delete(`/api/blogs/${badId}`)
      .set("Authorization", userToken)
      .expect(404);
  });
});

describe("updating a blog", () => {
  let userToken;
  let blogId;
  beforeEach(async () => {
    const blog = await testHelper.makeNewBlog();
    blogId = blog._id;
    const initUser = testHelper.newUser;
    const user = await api
      .post("/api/login")
      .send({ username: initUser.username, password: initUser.password });
    userToken = `Bearer ${user.body.token}`;
  });

  test("should succeed with a valid update", async () => {
    await api
      .put(`/api/blogs/${blogId}`)
      .send(testHelper.blogUpdate)
      .set("Authorization", userToken)
      .expect(200);
  });

  test("should return the updated blog", async () => {
    const result = await api
      .put(`/api/blogs/${blogId}`)
      .send(testHelper.blogUpdate)
      .set("Authorization", userToken);
    const updatedBlogInDb = await testHelper.getBlog(blogId);

    expect(result.body.id).toEqual(updatedBlogInDb.id);
    expect(result.body.author).toEqual(updatedBlogInDb.author);
    expect(result.body.author).toEqual(testHelper.blogUpdate.author);
  });

  test("should fail with an invalid update document", async () => {
    await api
      .put(`/api/blogs/${blogId}`)
      .send(testHelper.badBlogUpdate)
      .set("Authorization", userToken)
      .expect(400);
  });

  test("should fail with invalid authorization", async () => {
    await api
      .put(`/api/blogs/${blogId}`)
      .send(testHelper.blogUpdate)
      .expect(401);
  });
});
