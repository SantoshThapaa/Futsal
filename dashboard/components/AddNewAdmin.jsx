import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../src/main";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);  // to store the profile picture file

  const navigateTo = useNavigate();

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!firstName || !lastName || !email || !phone || !nic || !gender || !password || !profilePic) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("nic", nic);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("profilePic", profilePic); // Ensure the file is appended

    // Log the FormData to ensure everything is added properly
    console.log("FormData:", formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/admin/addnew",
        formData,  // Sending FormData to the backend
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");

      // Reset the form after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setGender("");
      setPassword("");
      setProfilePic(null);
    } catch (error) {
      console.error("Error response:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">ADD NEW ADMIN</h1>
        <form onSubmit={handleAddNewAdmin}>
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
          </div>
          <div>
            <label>Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profilePic && <p>Selected File: {profilePic.name}</p>}
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD NEW ADMIN</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
