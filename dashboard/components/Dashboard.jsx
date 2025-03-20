import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Context } from "../src/main";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    if (!admin?.courtId) return;  // Ensure courtId exists before fetching

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/courts/${admin.courtId}/bookings`, // Fetch bookings by courtId
          { withCredentials: true }
        );
        setBookings(data.bookings);  // Set the fetched bookings
      } catch (error) {
        setBookings([]);  // In case of an error, set bookings to an empty array
        toast.error("Failed to fetch bookings");
      }
    };
    
    fetchBookings();
  }, [admin?.courtId]);  // Refetch bookings if courtId changes

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/courts/${admin.courtId}/bookings/${bookingId}`, // Update booking status
        { status },
        { withCredentials: true }
      );
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId  // Correctly identify the booking by bookingId
            ? { ...booking, status }
            : booking
        )
      );
      toast.success(data.message);  // Show success message
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/court.png" alt="courtImg" />
            <div className="content">
              <div>
                <p>Welcome,</p>
                <h5>{admin?.firstName} {admin?.lastName}</h5>
              </div>
              <p>Manage all court bookings efficiently!</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Bookings</p>
            <h3>{bookings.length}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Bookings</h5>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Court Name</th>
                <th>Booking Date</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.reason.split(" ")[2]}</td> {/* Extract user ID from the reason */}
                    <td>{booking.court?.name}</td>
                    <td>{new Date(booking.date).toLocaleDateString()} 
                    {` ${booking.startTime} - ${booking.endTime}`}</td>
                    <td>{booking.slot}</td>
                    <td>
                      <select
                        className={`value-${booking.status.toLowerCase()}`}
                        value={booking.status}
                        onChange={(e) =>
                          handleUpdateStatus(booking.bookingId, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      {booking.isCompleted ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Bookings Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
