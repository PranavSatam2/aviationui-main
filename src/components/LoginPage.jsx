import React, { useState } from "react";
import axios from "axios";
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
        navigate("/homePage"); // This will navigate to the home page ("/")
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
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
  <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="row w-100 justify-content-center">
      <div className="col-md-4 col-sm-6">
        <form
          className="bg-light p-4 rounded shadow-sm"
          style={{ backgroundColor: "#f7f7f7" }}
          onSubmit={handleLogin}
        >
          <h2 className="text-center mb-4">Login</h2>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default LoginPage;
