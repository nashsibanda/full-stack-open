import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showNewBlogForm, setShowNewBlogForm] = useState(true);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogUrl, setBlogUrl] = useState("");

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem("loggedInUser");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async event => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });
            window.localStorage.setItem("loggedInUser", JSON.stringify(user));
            blogService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setErrorMessage("Wrong credentials!");
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    const logOut = () => {
        window.localStorage.removeItem("loggedInUser");
        setUser(null);
    };

    const toggleNewBlogForm = () => {
        setShowNewBlogForm(!showNewBlogForm);
    };

    const handleNewBlog = async event => {
        event.preventDefault();

        try {
            const newBlog = {
                title: blogTitle,
                author: blogAuthor,
                url: blogUrl,
            };
            const response = await blogService.create(newBlog);
            setBlogs([...blogs, newBlog]);
        } catch (exception) {
            setErrorMessage("Invalid data sent!");
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    const loginForm = () => (
        <div>
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
                <div>
                    Username:{" "}
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    Password:{" "}
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );

    const blogsList = () => (
        <div>
            <h2>blogs</h2>
            <div>
                {user.name} logged in. <button onClick={logOut}>Log Out</button>
            </div>
            <br />
            <div>
                <button onClick={toggleNewBlogForm}>
                    {showNewBlogForm ? "Cancel" : "Add New Blog"}
                </button>
            </div>
            {showNewBlogForm && newBlogForm()}
            <br />
            {blogs.map(blog => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );

    const newBlogForm = () => (
        <div>
            <h3>Add New Blog</h3>
            <form onSubmit={handleNewBlog}>
                <div>
                    Title:{" "}
                    <input
                        type="text"
                        value={blogTitle}
                        name="Title"
                        onChange={({ target }) => setBlogTitle(target.value)}
                    />
                </div>
                <div>
                    Author:{" "}
                    <input
                        type="text"
                        value={blogAuthor}
                        name="Author"
                        onChange={({ target }) => setBlogAuthor(target.value)}
                    />
                </div>
                <div>
                    Url:{" "}
                    <input
                        type="text"
                        value={blogUrl}
                        name="Url"
                        onChange={({ target }) => setBlogUrl(target.value)}
                    />
                </div>
                <br />
                <button type="submit">Add Blog</button>
            </form>
        </div>
    );

    return user ? blogsList() : loginForm();
};

export default App;
