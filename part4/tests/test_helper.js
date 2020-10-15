const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    likes: 3,
    title: "NashBlog",
    author: "Dr. Nash",
    url: "nashblog.com",
  },
  {
    likes: 6,
    title: "Nash's Other Blog",
    author: "Dr. Nash",
    url: "nashsotherblog.com",
  },
  {
    likes: 12,
    title: "BBC News",
    author: "BBC News",
    url: "http://www.bbc.com",
  },
];

const nonExistantId = async () => {
  const blog = new Blog({
    title: "notarealblog",
    author: "no-one",
    url: "fakeblog.fake",
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find();
  return blogs.map(blog => blog.toJSON());
};

const newBlog = {
  title: "A New Blog",
  author: "Fresh Face",
  url: "www.anewblog.com",
};

const newBlogNoUrl = {
  title: "A New Blog",
  author: "Fresh Face",
};

const newBlogNoTitle = {
  author: "Fresh Face",
  url: "www.anewblog.com",
};

module.exports = {
  initialBlogs,
  nonExistantId,
  blogsInDb,
  newBlog,
  newBlogNoTitle,
  newBlogNoUrl,
};
