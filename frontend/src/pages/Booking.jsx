import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const { user } = useContext(Context); // Assuming user info is stored in context
  const navigateTo = useNavigate();

  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/courts/all");
        setCourts(data.courts);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };
    fetchCourts();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("Please log in to book a court.");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/courts/${courtId}/book`,
        {
          date,
          startTime,
          endTime,
          userId: user._id, // Passing user ID from context
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);
      navigateTo("/"); // Redirect after successful booking
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
    }
  };

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
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <button type="submit">Book Court</button>
      </form>
    </div>
  );
};

export default Booking;
