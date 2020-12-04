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

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem("loggedInUser");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
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
            {blogs.map(blog => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );

    return user ? blogsList() : loginForm();
};

export default App;
