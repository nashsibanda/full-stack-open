const blogsRouter = require("express").Router();
const logger = require("../utils/logger");
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  logger.info(blog);

  const result = await blog.save();
  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id);
  if (blogToDelete) {
    await Blog.deleteOne({ _id: blogToDelete._id });
    res.json(blogToDelete);
  } else {
    res.status(404).end();
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const updateDocument = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    updateDocument,
    { new: true, runValidators: true }
  );
  res.json(updatedBlog);
});

module.exports = blogsRouter;
