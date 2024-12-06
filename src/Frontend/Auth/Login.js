import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({
    Email: "",
    Password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.Email || !credentials.Password) {
      setError("Both fields are required!");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email: credentials.Email,
        password: credentials.Password,
      });

      localStorage.setItem('userId', response.data.userId);

      setSuccess("Login successful! Redirecting...");
      setError("");

      setTimeout(() => navigate("/flights"), 2000); // Simulate redirect
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={credentials.Email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              value={credentials.Password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="register-link">
          <p>New user?</p>
          <button className="register-button" onClick={() => navigate("/register")}>
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;