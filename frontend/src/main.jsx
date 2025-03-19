import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Creating Context
export const Context = createContext({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  loading: true, // Adding loading state here
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle data fetch

  // Fetch user data from backend or localStorage if the user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Assuming you store the JWT token in localStorage

      if (token) {
        try {
          console.log("Fetching user data..."); // Debugging line
          const response = await axios.get("http://localhost:4000/api/v1/user/user/me", {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the header
            },
          });

          console.log("User data fetched:", response.data.user); // Log the user data

          setUser(response.data.user); // Set user data in context
          setIsAuthenticated(true); // Mark user as authenticated
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
          setUser(null); // Reset user if there is an error
        }
      } else {
        setIsAuthenticated(false);
        setUser(null); // Reset user if there is no token
      }
      setLoading(false); // Set loading to false after the API call completes
    };

    fetchUser(); // Run the function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading }}>
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
