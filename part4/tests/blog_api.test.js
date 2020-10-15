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

test("there are four blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(testHelper.initialBlogs.length);
});

test("the unique identifier of the blogs is called 'id'", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

describe("POST-ing a new blog", () => {
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
