const blogsRouter = require("express").Router();
const logger = require("../utils/logger");
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

blogsRouter.post("/", (req, res, next) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  logger.info(blog);

  blog
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;
