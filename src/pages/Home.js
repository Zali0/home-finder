import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
          <div style={{display:"flex", alignContent:"center"}}>
            <i className="fa-solid fa-house-chimney fa-beat" style={{color: '#00ffff'}}></i>
            <p> Home Finder</p>
          </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="fa-solid fa-right-to-bracket me-1"></i>Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  <i className="fa-solid fa-user-plus me-1"></i>Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1568605114967-8130f3a36994') center/cover",
          height: "75vh",
        }}
      >
        <div>
          <h1 className="display-3 fw-bold mb-3">
            Find Your <span className="text-warning">Dream Home</span> Today
          </h1>
          <p className="lead mb-4">
            <i className="fa-solid fa-magnifying-glass-location me-2"></i>
            Browse thousands of verified properties for rent and sale.
          </p>
          <Link
            to="/user"
            className="btn btn-warning btn-lg shadow-sm px-4 py-2 me-2"
          >
            <i className="fa-solid fa-compass me-2"></i>Explore Properties
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h2 className="mb-4 fw-bold">
            <i className="fa-solid fa-star text-warning me-2"></i>Why Choose
            Home Finder?
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 hover-shadow">
                {/* <i class="fa-solid fa-square-check"></i> */}
                <i className="fa-solid fa-square-check fa-2x text-success mb-3"></i>
                <h4>Verified Listings</h4>
                <p className="text-muted">
                  Every property is verified to ensure authenticity. No third party control.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 hover-shadow">
                <i className="fa-solid fa-lock fa-2x text-primary mb-3"></i>
                <h4>Secure Transactions</h4>
                <p className="text-muted">
                  Your safety and security are our priority. Pay Securely with Paystack
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 hover-shadow">
                <i className="fa-solid fa-filter fa-2x text-warning mb-3"></i>
                <h4>Easy Search & Filters</h4>
                <p className="text-muted">
                  Easily find your dream property with powerful search tools. Less or no Hassle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Home Finder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
