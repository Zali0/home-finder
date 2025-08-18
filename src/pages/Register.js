import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const user = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User"
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7000/api/user", formData);
      toast.success("User added successfully!");
      setFormData(user);
      navigate("/user");
    } catch (error) {
      console.error("Error adding user:", error.response ? error.response.data : error.message);
      toast.error("User already exists or server error.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      ></div>

      {/* Card */}
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          zIndex: 2,
        }}
      >
        {/* Title */}
        <h2 className="text-center mb-4 text-primary fw-bold">
          <i className="fa-solid fa-user-plus me-2"></i> Register
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                minlength="8"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minlength="8"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-user-plus me-2"></i> Register
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-decoration-none text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
