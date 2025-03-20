import express from "express";
import {
    addNewCourt,
    getAllCourts,
    getCourtById,
    updateCourt,
    deleteCourt,
    blockCourtSlot,
    bookCourt,
    updateBookingStatus,
    getAllBookings,
    deleteBooking,
} from "../controller/courtController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";
import { checkMaintenanceMode } from "../middlewares/maintenanceMiddleware.js";

const router = express.Router();


router.post(
    "/new",
    isAdminAuthenticated, 
    addNewCourt
);
router.get("/all", getAllCourts);
router.get("/:id", getCourtById);
router.put(
    "/update/:id",
    isAdminAuthenticated, 
    updateCourt
);
router.delete(
    "/delete/:id",
    isAdminAuthenticated, 
    deleteCourt
);
router.post(
    "/block-slot/:id",
    isAdminAuthenticated, 
    blockCourtSlot
);
router.post(
    "/:courtId/book",
    checkMaintenanceMode, 
    isUserAuthenticated, 
    bookCourt
);
router.get("/:courtId/bookings", isUserAuthenticated, getAllBookings);
router.put("/:courtId/bookings/:bookingId", isAdminAuthenticated, updateBookingStatus);
router.delete("/:courtId/bookings/:bookingId", isAdminAuthenticated, deleteBooking);



export default router;
