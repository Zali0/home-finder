import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // If user is not logged in → go to login
  if (!user) {
    // console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }


  if (role === "Admin") {
    // If user is an admin, allow access
    if (user.role === "Admin") {
      return children;
    } else {
      console.log("Access denied for non-admin user");
      return <Navigate to="/unauthorized" />;
    }
  }

  if (role === "User") {
    // If user is a user, allow access
    if (user.role === "User") {
      return children;
    } else {
      console.log("Access denied for admin users");
      return <Navigate to="/unauthorized" />;
    }
  }

}
