import React from 'react'
import "./App.css";
import { BrowseRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';  
import Footer from './pages/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  // const { isAuthenticated, setIsAuthenticated, setUser } =
    // useContext(Context);
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/booking' element={<Booking/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      <ToastContainer position="top-center"/>
    </Router>
    </>
  )
}

export default App