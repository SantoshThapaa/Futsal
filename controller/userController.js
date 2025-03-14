import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";


export const Register = catchAsyncErrors(async (req, res, next) => {
    const { 
        firstName,
        lastName,
        email,
        phone, 
        password, 
        gender,
        nic,
        role,
        profilePic
         } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !nic || !gender || !role || !profilePic) { 
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("Email already exists", 400));
    }
    const userRole = role || "User"; 
    const userProfilePic = profilePic || "default.jpg"; 
    user = await User.create({
        firstName, lastName, email, phone, password, gender, nic, role: userRole, profilePic: userProfilePic
    });
    res.status(200).json({
        success: true,
        message:" User registered successfully",
    });
});