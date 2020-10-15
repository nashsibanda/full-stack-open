const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testHelper = require("./test_helper");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany();

  const blogObjects = testHelper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
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

    expect(response.body).toEqual(blogToGet);
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
  test("should increase the number of total blogs by one", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(testHelper.initialBlogs.length);

    await api.post("/api/blogs").send(testHelper.newBlog);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1);
  });

  test("should include the new blog's content", async () => {
    await api.post("/api/blogs").send(testHelper.newBlog);

    const blogsAtEnd = await testHelper.blogsInDb();
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain("A New Blog");
  });

  test("should assign a likes value of 0 if likes property is missing", async () => {
    await api.post("/api/blogs").send(testHelper.newBlog);

    const blogsAtEnd = await testHelper.blogsInDb();
    const addedBlog = blogsAtEnd.find(b => b.title === "A New Blog");
    expect(addedBlog.likes).toBe(0);
  });

  test("should respond with 400 if title or url is missing", async () => {
    await api.post("/api/blogs").send(testHelper.newBlogNoTitle).expect(400);
    await api.post("/api/blogs").send(testHelper.newBlogNoUrl).expect(400);
  });
});

describe("deleting a blog", () => {
  test("should succeed if id is valid", async () => {
    const blogToDelete = await testHelper.oneBlogInDb();
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(200);
  });

  test("should return the deleted blog", async () => {
    const blogToDelete = await testHelper.oneBlogInDb();
    const response = await api.delete(`/api/blogs/${blogToDelete.id}`);

    expect(response.body).toEqual(blogToDelete);
  });

  test("should fail if id does not exist", async () => {
    const badId = await testHelper.nonExistentId();
    await api.delete(`/api/blogs/${badId}`).expect(404);
  });
});

describe("updating a blog", () => {
  test("should succeed with a valid update", async () => {
    const blogToUpdate = await testHelper.oneBlogInDb();
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(testHelper.blogUpdate)
      .expect(200);
  });

  test("should return the updated blog", async () => {
    const blogToUpdate = await testHelper.oneBlogInDb();
    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(testHelper.blogUpdate);
    const updatedBlogInDb = await testHelper.oneBlogInDb();

    expect(result.body).toEqual(updatedBlogInDb);
  });

  test("should fail with an invalid update document", async () => {
    const blogToUpdate = await testHelper.oneBlogInDb();
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(testHelper.badBlogUpdate)
      .expect(400);
  });
});
