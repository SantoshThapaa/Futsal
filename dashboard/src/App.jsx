import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewAdmin from "../components/AddNewAdmin";
import "./App.css";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Court from "../components/Court";
import Message from "../components/Message";
import AddNewCourt from "../components/AddNewCourt";
import Sidebar from "../components/Sidebar";

const App = () => {
  const { isAuthenticated, setIsAuthenticated,  setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/court/addnew" element={<AddNewCourt />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/court" element={<Court />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;