import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";

const Booking = () => {
  const { user } = useContext(Context); // Access user from context
  const navigateTo = useNavigate();

  const [courts, setCourts] = useState([]); // State to store courts data
  const [courtId, setCourtId] = useState(""); // State to store selected court ID
  const [date, setDate] = useState(""); // State to store selected date
  const [startTime, setStartTime] = useState(""); // State to store start time
  const [endTime, setEndTime] = useState(""); // State to store end time
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch courts data when the component mounts
  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true); // Start loading
      try {
        const { data } = await axios.get("http://localhost:4000/api/courts/all");
        setCourts(data.courts); // Set fetched courts data
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching courts:", error);
        setLoading(false); // Stop loading on error
      }
    };
    fetchCourts();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  const handleBooking = async (e) => {
    e.preventDefault();
    // Debugging: Check if user._id is being accessed correctly
    console.log("User ID from context:", user?._id); // Add this line to check the user ID

    // Ensure the user is logged in and has a valid user ID
    if (!user || !user._id) {
     
      toast.error("Please log in to book a court.");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/courts/${courtId}/book`, // API endpoint for booking
        {
          date,
          startTime,
          endTime,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message); // Success message
      navigateTo("/"); // Redirect after successful booking
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed."); // Error handling
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while data is being fetched
  }

  return (
    <div className="container form-component booking-form">
      <h2>Book a Futsal Court</h2>
      <p>Select a court and pick a date & time for your game!</p>
      <form onSubmit={handleBooking}>
        <div>
          <select value={courtId} onChange={(e) => setCourtId(e.target.value)} required>
            <option value="">Select Court</option>
            {courts.map((court) => (
              <option key={court._id} value={court._id}>
                {court.name} - {court.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book Court</button>
      </form>
    </div>
  );
};

export default Booking;
