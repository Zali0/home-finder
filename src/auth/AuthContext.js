import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);


  const loadUser = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/profile", {
          credentials: "include",
        });
        // console.log
        
        if (res.ok) {
          const data = await res.json();
          const decoded = jwtDecode(data.token);
          setUser(decoded);
          // console.log("Auth response:", decoded);

          
        } 
        else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };



  const logout = async () => {
    await fetch("http://localhost:7000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


