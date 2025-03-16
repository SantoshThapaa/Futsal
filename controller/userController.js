import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";

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
    generateToken(user, "User registered successfully", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    if (password !== confirmPassword) {
      return next(
        new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
  
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
      return next(new ErrorHandler(`User Not Found With This Role!`, 400));
    }
    generateToken(user, "Login Successfully!", 201, res);
  });

  export const addNewAdmin = catchAsyncErrors(async(req, res, next)=>{
    const{
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
    const isRegistered = await User.findOne({ email });
    if (isRegistered){
        return next(new ErrorHandler(`$(isRegistered.role) with This Email Alredy Exists!`));
    }
    const admin = await User.create({firstName, lastName, email, phone , password, gender, nic, role: "Admin", profilePic});
    res.status(200).json({
        success: true,
        message:"New Admin Registered", 
    })
  });