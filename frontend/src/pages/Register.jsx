import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null); 

  const navigateTo = useNavigate();

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // Use FormData to send files
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("nic", nic);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("role", "User");
    if (profilePic) {
        formData.append("profilePic", profilePic);
    }

    try {
      await axios.post("http://localhost:4000/api/v1/user/register", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // Important
      })
      .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
};

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="container form-component register-form">
        <h2>Sign Up</h2>
        <p>Please Sign Up To Continue</p>
        <p>
          Join our platform and experience hassle-free futsal bookings with easy team management!
        </p>
        <form onSubmit={handleRegistration} encType="multipart/form-data">
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label>Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profilePic && <p>Selected File: {profilePic.name}</p>}
          </div>

          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Already Registered?</p>
            <Link
              to={"/signin"}
              style={{ textDecoration: "none", color: "#271776ca" }}
            >
              Login Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
