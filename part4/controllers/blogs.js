const blogsRouter = require("express").Router();
const logger = require("../utils/logger");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find().populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  logger.info(blog);

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id)
    return res.status(401).json({ error: "Token missing or invalid" });

  const user = await User.findById(decodedToken.id);
  const blogToDelete = await Blog.findById(req.params.id);

  if (blogToDelete) {
    if (blogToDelete.user.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ error: "A blog can only be deleted by its associated user" });
    }

    await Blog.deleteOne({ _id: blogToDelete._id });
    res.json(
      await blogToDelete
        .populate("user", { username: 1, name: 1 })
        .execPopulate()
    );
  } else {
    res.status(404).end();
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id)
    return res.status(401).json({ error: "Token missing or invalid" });

  const user = await User.findById(decodedToken.id);
  const blogToUpdate = await Blog.findById(req.params.id);

  if (blogToUpdate) {
    if (blogToUpdate.user.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ error: "A blog can only be deleted by its associated user" });
    }

    const updateDocument = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateDocument,
      { new: true, runValidators: true }
    );
    res.json(
      await updatedBlog
        .populate("user", { username: 1, name: 1 })
        .execPopulate()
    );
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;
