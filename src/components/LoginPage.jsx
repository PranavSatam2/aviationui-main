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
<div style={{ 
  backgroundColor: "#f5f7fa", 
  minHeight: "100vh",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
}}>
  <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="row w-100 justify-content-center">
      <div className="col-md-4 col-sm-6">
        <div className="text-center mb-4">
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "700",
            color: "#1877F2" 
          }}>Welcome Back</h1>
          <p style={{ 
            fontSize: "15px", 
            color: "#65676B",
            marginBottom: "25px" 
          }}>Sign in to continue to your account</p>
        </div>
        
        <form
          style={{ 
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" 
          }}
          onSubmit={handleLogin}
        >
          {errorMessage && (
            <div style={{
              backgroundColor: "#FFEBE9",
              border: "1px solid #FFC2C0",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              color: "#D73A49",
              fontSize: "14px"
            }}>
              {errorMessage}
            </div>
          )}
          
          <div style={{ marginBottom: "24px" }}>
            <label 
              htmlFor="username" 
              style={{ 
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#212121"
              }}
            >
              Username
            </label>
            <div style={{
              position: "relative"
            }}>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E4E6EB",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none",
                  backgroundImage: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                onBlur={(e) => e.target.style.borderColor = "#E4E6EB"}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginBottom: "8px" 
            }}>
              <label 
                htmlFor="password" 
                style={{ 
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#212121"
                }}
              >
                Password
              </label>
              <a 
                href="#" 
                style={{ 
                  fontSize: "14px",
                  color: "#1877F2",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{
              position: "relative"
            }}>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E4E6EB",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                onBlur={(e) => e.target.style.borderColor = "#E4E6EB"}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{
              width: "100%",
              backgroundColor: "#1877F2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
              marginBottom: "20px"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#166FE5"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#1877F2"}
          >
            Sign In
          </button>
          
          <div style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#65676B"
          }}>
            Don't have an account? <a href="#" style={{ color: "#1877F2", textDecoration: "none", fontWeight: "500" }}>Sign up</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default LoginPage;
