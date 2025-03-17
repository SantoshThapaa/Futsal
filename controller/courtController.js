import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Court } from "../models/courtModel.js";
import cloudinary from "cloudinary";
import { User } from "../models/userSchema.js";

export const addNewCourt = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Court Image is Required!", 400));
    }

    const { courtAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(courtAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }

    const { name, location, email, phone, pan, password, hourlyRate, surfaceType, openingHours, facilities, availability, membershipDiscount } = req.body;

    // ✅ Parse `openingHours` from string to JSON object
    let parsedOpeningHours;
    try {
        parsedOpeningHours = JSON.parse(openingHours);
    } catch (error) {
        return next(new ErrorHandler("Invalid format for openingHours. Send it as a JSON string.", 400));
    }

    // ✅ Ensure required fields are present
    if (
        !name || 
        !location || 
        !email || 
        !pan || 
        !phone || 
        !password || 
        !hourlyRate || 
        !surfaceType ||
        !parsedOpeningHours?.startTime || 
        !parsedOpeningHours?.endTime
    ) {
        return next(new ErrorHandler("Please fill all required details, including opening hours", 400));
    }

    const isRegistered = await Court.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Court with this Email Already Exists!", 400));
    }

    let cloudinaryResponse;
    try {
        cloudinaryResponse = await cloudinary.uploader.upload(courtAvatar.tempFilePath);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return next(new ErrorHandler("Failed to upload court avatar to Cloudinary", 500));
    }

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        return next(new ErrorHandler("Cloudinary upload failed", 500));
    }

    // ✅ Ensure default values for optional fields
    const court = await Court.create({
        name,
        email,
        phone,
        pan,
        location,
        password,
        pricing: {
            hourlyRate,
            membershipDiscount: membershipDiscount || 0, // Default value if not provided
        },
        surfaceType,
        openingHours: {
            startTime: parsedOpeningHours.startTime,
            endTime: parsedOpeningHours.endTime,
        },
        facilities: facilities ? facilities.split(",") : ["Changing Rooms", "Parking", "Floodlights"], // Convert string to array
        availability: availability !== undefined ? availability : true, // Default to true
        courtAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "New court registered successfully",
        court,
    });
});

export const getAllCourts = catchAsyncErrors(async (req, res, next) => {
    const courts = await Court.find();
    res.status(200).json({ success: true, courts });
});


export const getCourtById = catchAsyncErrors(async (req, res, next) => {
    const court = await Court.findById(req.params.id);
    if (!court) {
        return next(new ErrorHandler("Court not found!", 404));
    }
    res.status(200).json({ success: true, court });
});


export const updateCourt = catchAsyncErrors(async (req, res, next) => {
    let court = await Court.findById(req.params.id);
    if (!court) {
        return next(new ErrorHandler("Court not found!", 404));
    }

    const { name, location, email, phone, pan, hourlyRate, surfaceType, availability } = req.body;

    // ✅ Update Court Fields
    court.name = name || court.name;
    court.location = location || court.location;
    court.email = email || court.email;
    court.phone = phone || court.phone;
    court.pan = pan || court.pan;
    court.pricing.hourlyRate = hourlyRate || court.pricing.hourlyRate;
    court.surfaceType = surfaceType || court.surfaceType;
    court.availability = availability !== undefined ? availability : court.availability;

  
    if (req.files && req.files.courtAvatar) {
        const courtAvatar = req.files.courtAvatar;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(courtAvatar.mimetype)) {
            return next(new ErrorHandler("File Format Not Supported!", 400));
        }

        await cloudinary.uploader.destroy(court.courtAvatar.public_id);

        const cloudinaryResponse = await cloudinary.uploader.upload(courtAvatar.tempFilePath);
        if (!cloudinaryResponse.secure_url) {
            return next(new ErrorHandler("Failed to upload new court avatar", 500));
        }
        court.courtAvatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    await court.save();

    res.status(200).json({
        success: true,
        message: "Court updated successfully",
        court,
    });
});


export const bookCourt = catchAsyncErrors(async (req, res, next) => {
    const { date, startTime, endTime, userId } = req.body;

    // ✅ Ensure `courtId` is correctly extracted
    const { courtId } = req.params; 
    if (!courtId) {
        return next(new ErrorHandler("Court ID is missing in request!", 400));
    }

    // ✅ Find court by ID
    const court = await Court.findById(courtId);
    if (!court) {
        return next(new ErrorHandler("Court not found!", 404));
    }

    // ✅ Ensure User Exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    // ✅ Ensure Date is Valid
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
        return next(new ErrorHandler("Invalid booking date!", 400));
    }

    // ✅ Check if slot is already booked
    const isUnavailable = court.blockedSlots.some((slot) => {
        return slot.date.toISOString().split("T")[0] === date &&
            ((startTime >= slot.startTime && startTime < slot.endTime) ||
             (endTime > slot.startTime && endTime <= slot.endTime));
    });

    if (isUnavailable) {
        return next(new ErrorHandler("This time slot is unavailable!", 400));
    }

    // ✅ Add Booking
    court.blockedSlots.push({
        date: bookingDate,
        startTime,
        endTime,
        reason: `Booked by user ${userId}`,
    });

    await court.save();

    res.status(201).json({
        success: true,
        message: "Court booked successfully!",
        booking: {
            courtId: court._id,
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            date,
            startTime,
            endTime,
        },
    });
});



export const deleteCourt = catchAsyncErrors(async (req, res, next) => {
    const court = await Court.findById(req.params.id);
    if (!court) {
        return next(new ErrorHandler("Court not found!", 404));
    }

    
    await cloudinary.uploader.destroy(court.courtAvatar.public_id);

    await court.deleteOne();

    res.status(200).json({
        success: true,
        message: "Court deleted successfully",
    });
});


export const blockCourtSlot = catchAsyncErrors(async (req, res, next) => {
    const { date, startTime, endTime, reason } = req.body;
    const court = await Court.findById(req.params.id);

    if (!court) {
        return next(new ErrorHandler("Court not found!", 404));
    }

    const isOverlapping = court.blockedSlots.some((slot) => {
        return slot.date.toISOString().split("T")[0] === date &&
            slot.startTime === startTime &&
            slot.endTime === endTime;
    });

    if (isOverlapping) {
        return next(new ErrorHandler("This slot is already blocked!", 400));
    }

    court.blockedSlots.push({
        date: new Date(date),
        startTime,
        endTime,
        reason: reason || "Maintenance",
    });

    await court.save();

    res.status(200).json({
        success: true,
        message: "Court slot blocked successfully",
    });
});
