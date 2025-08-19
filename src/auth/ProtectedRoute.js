import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  
  if (!user) {
    return <Navigate to="/login" />;
  }


  if (role === "Admin") {
    // If user is an admin, allow access
    if (user.role === "Admin") {
      return children;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }

  if (role === "User") {
    if (user.role === "User") {
      return children;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }

}
