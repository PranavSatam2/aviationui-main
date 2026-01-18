// LoginPage.jsx - Enhanced Version with AMC Logo and Fainter Backgrounds
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import Footer from "./Footer";
import styles from "./Login.module.css";
import { useRoleMenus } from "../context/RoleMenuContext";
import AMCLOGO from "../static/img/AMCLOGO.jpg";

// Background images - Aviation themed (with reduced opacity in CSS)
const backgroundImages = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=1920",
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { refreshMenus } = useRoleMenus();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);

    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Generate light particles (fewer for performance)
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 8; i++) {
      particles.push(
        <div
          key={i}
          className={styles.particle}
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 15}s`,
          }}
        />
      );
    }
    return particles;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const usernameRegex = /^[a-zA-Z0-9\s]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!usernameRegex.test(username)) {
      setErrorMessage("Username must contain only alphabets and numbers.");
      setIsLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including a letter, a number, and a special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      const response = await axiosInstance.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "X-User-Location": location,
          },
        }
      );

      if (response.status === 200) {
        if (response && response.data && response.data.token) {
          const { token, passwordExpired, username, role } = response.data;

          sessionStorage.setItem("username", username);
          sessionStorage.setItem("jwt_token", token);
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("location", location);

          if (passwordExpired) {
            alert("Please change your password!");
            navigate("/passwordChange");
          } else {
            try {
              const roleResponse = await axiosInstance.get(
                `/api/roles/byname/${role}`
              );
              if (roleResponse?.data?.id) {
                const roleId = roleResponse.data.id;
                sessionStorage.setItem("roleId", roleId);

                await refreshMenus();
                navigate("/homePage");
              } else {
                setErrorMessage(
                  "User role is not configured correctly. Please contact support."
                );
              }
            } catch (roleError) {
              setErrorMessage("Error fetching role information.");
            }
          }
        }
      } else if (response.status === 401) {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Please change your password!");
        navigate("/passwordChange");
      } else if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Background Slider */}
      <div className={styles.backgroundSlider}>
        {backgroundImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Background ${index + 1}`}
            className={`${styles.slideImage} ${
              index === currentImageIndex ? styles.active : ""
            }`}
          />
        ))}
      </div>

      {/* Animated Gradient Overlay */}
      <div className={styles.overlay}></div>

      {/* Light Particles */}
      <div className={styles.particles}>{generateParticles()}</div>

      {/* Login Container */}
      <div
        className={`${styles.loginContainer} ${fadeIn ? styles.fadeIn : ""}`}
      >
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              <div className={styles.logoContainer}>
                <img
                  style={{ height: "50px", width: "50px" }}
                  src={AMCLOGO}
                  alt="AMC Logo"
                />
              </div>
              <span>Welcome To AMC Technology</span>
            </h2>
          </div>

          <div className={styles.body}>
            <form onSubmit={handleLogin}>
              {/* Location Select */}
              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Location
                </label>
                <select
                  id="location"
                  className={styles.formInput}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="">-- Select Location --</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              {/* Username Input */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className={styles.formInput}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={styles.formInput}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              {/* Form Options */}
              <div className={styles.formOptions}>
                <div className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <div className={styles.forgotPassword}>
                  <a href="#" className={styles.link}>
                    Forgot password?
                  </a>
                  <span className={styles.comingSoonBadge}>Coming Soon..</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`${styles.loginButton} ${
                  isLoading ? styles.buttonLoading : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className={styles.errorMessage}>
                <AlertCircle className={styles.errorIcon} />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Signup Option with Coming Soon */}
            <div className={styles.signupOption}>
              <p>
                Don't have an account?{" "}
                <span className={styles.linkDisabled}>
                  Sign up
                  <span className={styles.comingSoonBadge}>Coming Soon..</span>
                </span>
              </p>
            </div>

            {/* Social Login with Coming Soon */}
            <div className={styles.socialLogin}>
              <div className={styles.divider}>
                <span>
                  Or continue with
                  <span className={styles.comingSoonLabel}>Coming Soon..</span>
                </span>
              </div>

              <div className={styles.socialButtons}>
                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.disabled}`}
                  disabled
                >
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.disabled}`}
                  disabled
                >
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325v21.351C0 23.407 0.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12V24h6.116c0.73 0 1.323-0.593 1.323-1.325V1.325C24 0.593 23.407 0 22.675 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.disabled}`}
                  disabled
                >
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;