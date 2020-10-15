const listHelper = require("../utils/list_helper");

const emptyList = [];
const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];
const listWithManyBlogs = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    likes: 3,
    title: "NashBlog",
    author: "Nash",
    url: "nashblog.com",
    id: "5f8780855da8a23cef0aec39",
  },
  {
    likes: 6,
    title: "Nash's Other Blog",
    author: "Nash",
    url: "nashsotherblog.com",
    id: "5f8780855da8a23cef0aec40",
  },
  {
    likes: 12,
    title: "BBC News",
    author: "BBC News",
    url: "http://www.bbc.com",
    id: "5f878b5dfb6c3011e3fee425",
  },
];
const bestBlog = {
  likes: 12,
  title: "BBC News",
  author: "BBC News",
  url: "http://www.bbc.com",
  id: "5f878b5dfb6c3011e3fee425",
};

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(26);
  });
});

describe("favorite blogs", () => {
  test("should return the blog post with the most likes", () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    expect(result).toEqual(bestBlog);
  });

  test("when list has only one blog, should return that blog", () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    expect(result).toEqual(bestBlog);
  });
});

test("most blogs should return author with most likes", () => {
  const result = listHelper.mostBlogs(listWithManyBlogs);
  expect(result).toEqual("Nash");
});

test("most likes should return author with most likes", () => {
  const result = listHelper.mostLikes(listWithManyBlogs);
  expect(result).toEqual("BBC News");
});
