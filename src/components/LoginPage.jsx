import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogin = async (e) => {
    e.preventDefault();

    // Input validation
    const usernameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      setErrorMessage("Username must contain only alphabets.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including a letter, a number, and a special character."
      );
      return;
    }

    try {
      // Make the API call to your backend
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      // Handle successful response
      if (response.status === 200) {
        console.log("Login Successful:", response.data);
        alert("Login successful!");

        // Redirect to the home page using navigate
        navigate("/"); // This will navigate to the home page ("/")
      }
    } catch (error) {
      // Handle error response
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
      console.error("Login Error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
