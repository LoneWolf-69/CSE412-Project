import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.Password !== userData.ConfirmPassword) {
      setError("Passwords do not match!");
      setSuccess("");
      return;
    }

    if (!userData.FirstName || !userData.LastName || !userData.Email || !userData.Password) {
      setError("All fields are required!");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/register", {
        firstName: userData.FirstName,
        lastName: userData.LastName,
        email: userData.Email,
        password: userData.Password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>
        <p>Fill in the details below to get started.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="FirstName"
              value={userData.FirstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="LastName"
              value={userData.LastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              value={userData.Password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="ConfirmPassword"
              value={userData.ConfirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="login-link">
          <p>Already have an account?</p>
          <button className="login-button" onClick={() => navigate("/login")}>
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;