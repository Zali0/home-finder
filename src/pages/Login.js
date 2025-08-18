import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user, setUser} = useContext(AuthContext);

  

  
  // ✅ Redirect only once when user.role is set
 useEffect(() => {
    if (user?.role) {
      navigate(user.role === 'Admin' ? '/admin' : '/user');
    }
  }, [user, navigate]);

  
  // if (loading) return <div>Loading...</div>;


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        email, password, rememberMe }, { withCredentials: true});
      
      
      if (res.data.token) {
        const decoded = jwtDecode(res.data.token);
        // console.log(res);
        setUser(decoded);
        toast.success("Login successful");
        
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      // console.error(err);
    }



    // Redirect based on user role
    if (user?.role) {
      if (user.role === 'Admin') { 
        navigate('/admin');
      }
      else if (user.role === 'User') {
        navigate('/user');
      }
      else {
        navigate('/login'); // Default redirect if role is not recognized 
      }
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
      }}>


      
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
          // textAlign: "center",
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
          <i className="fa-solid fa-right-to-bracket me-2"></i> Login
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="form-check mb-1" style={{marginLeft : "25%",display: "flex"}}>
            <input
              style={{width:"10%"}}
              className="form-check-input "
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
            />
            <label style={{width:"50%", marginLeft: "10px"}} className="form-check-label fw-semibold mb-4" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-sign-in-alt me-2"></i> Login
            </button>
          </div>
        </form>
        
        {/* Forgot Password */}
        <p className="text-center mt-3 mb-0">
          Forgot Password?{" "}
          <a
            href={'mailto: email@site.com'}
            className="fw-bold text-decoration-none text-primary"
          >
            Message Admin
          </a>
        </p>

        {/* Register Link */}
        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="fw-bold text-decoration-none text-primary">
            Register
          </Link>
        </p>

        
      </div>



    </div>
  );
}





