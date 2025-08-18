import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router basename="/home-finder">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute role="Admin" ><Admin /></ProtectedRoute>}/>
          <Route path="/user" element={<ProtectedRoute role="User"><User /></ProtectedRoute>}/>
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

