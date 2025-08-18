// src/pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div style={styles.container}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/" style={styles.link}>Go to Home</Link>
    </div>
  );
}

const styles = {
  container: {
    margin: '80px auto',
    textAlign: 'center',
    padding: '20px',
    maxWidth: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none'
  }
};

export default Unauthorized;
