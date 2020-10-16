const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

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

const nonExistentId = async () => {
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

const oneBlogInDb = async () => {
  const blog = await Blog.findOne({ title: "NashBlog" });
  return blog.toJSON();
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

const blogUpdate = {
  author: "Elvis",
};

const badBlogUpdate = {
  author: "a",
};

const usersInDb = async () => {
  const users = await User.find();
  return users.map(u => u.toJSON());
};

const initialUsers = [
  {
    username: "testuser",
    password: "secret",
    name: "Test User",
  },
  {
    username: "anotheruser",
    password: "secret2",
    name: "Another User",
  },
];

const newUser = {
  username: "nash",
  name: "Nash Sibanda",
  password: "password",
};

const newUserTakenUsername = {
  username: "testuser",
  name: "Nash Sibanda",
  password: "password",
};

const newUserShortPassword = {
  username: "nash",
  name: "Nash Sibanda",
  password: "a",
};

const setUpDb = async () => {
  await User.deleteMany();

  const hashPromiseArray = initialUsers.map(async u => {
    return {
      username: u.username,
      name: u.name,
      passwordHash: await bcrypt.hash(u.password, 10),
    };
  });

  const userObjects = await Promise.all(hashPromiseArray);
  const users = userObjects.map(u => new User(u));

  const savePromiseArray = users.map(u => u.save());
  await Promise.all(savePromiseArray);
  const dbUsers = await usersInDb();
  const userIds = dbUsers.map(u => u.id);

  await Blog.deleteMany();

  const blogObjects = initialBlogs.map(
    blog =>
      new Blog({
        ...blog,
        user: userIds[Math.floor(Math.random() * userIds.length)],
      })
  );
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
};

const makeNewUser = async () => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
  const user = new User({ ...newUser, passwordHash });
  return await user.save();
};

const makeNewBlog = async () => {
  const user = await makeNewUser();
  const blog = new Blog({ ...newBlog, user: user._id });
  return await blog.save();
};

const getBlog = async id => {
  const blog = await Blog.findById(id);
  return blog.toJSON();
};

module.exports = {
  initialBlogs,
  nonExistentId,
  blogsInDb,
  oneBlogInDb,
  newBlog,
  newBlogNoTitle,
  newBlogNoUrl,
  blogUpdate,
  badBlogUpdate,
  usersInDb,
  initialUsers,
  newUser,
  newUserTakenUsername,
  newUserShortPassword,
  setUpDb,
  makeNewUser,
  makeNewBlog,
  getBlog,
};
