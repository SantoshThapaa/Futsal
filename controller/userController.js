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
    if (
        !firstName ||
        !lastName ||
        !email || 
        !phone || 
        !password || 
        !nic ||
        !gender ||
        !role ||
        !profilePic
        ) { 
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

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password, confirmPassword, role} = req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please fill all details", 400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password do not match", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password or Email!", 400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found!", 400));
    }
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
    });
});