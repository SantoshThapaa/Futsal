import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const Register = catchAsyncErrors(async (req, res, next) => {
    const { 
        firstName,
        lastName,
        email,
        phone, 
        password, 
        gender,
        nic,
        role
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !nic || !gender || !role) { 
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("Email already exists", 400));
    }

    let profilePicUrl = "default.jpg"; 

    if (req.files && req.files.profilePic) {
        const file = req.files.profilePic;

        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(file.mimetype)) {
            return next(new ErrorHandler("Invalid file type. Please upload an image.", 400));
        }

        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(file.tempFilePath);
            profilePicUrl = cloudinaryResponse.secure_url;
        } catch (error) {
            return next(new ErrorHandler("File upload failed. Try again.", 500));
        }
    }

    user = await User.create({
        firstName, lastName, email, phone, password, gender, nic, role, profilePic: profilePicUrl
    });

    generateToken(user, "User registered successfully", 200, res);
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  // Check if all fields are provided
  if (!email || !password || !confirmPassword) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match!", 400));
  }

  // Find user by email and select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  // Check if password matches
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  // Generate and send the token if authentication is successful
  generateToken(user, "Login successfully!", 201, res);
  const token = response.data.token;
 localStorage.setItem("token", token); // Store token in localStorage
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
            !profilePic
            ) { 
            return next(new ErrorHandler("Please fill in all fields", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with This Email Alredy Exists!`));
    }
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone ,
        password,
        gender,
        nic,
        profilePic,
        role: "Admin"
    });
    res.status(200).json({
        success: true,
        message:"New Admin Registered", 
        admin,
    });
  });

  export const getAllCourts = catchAsyncErrors(async(req, res, next)=>{
    const courts = await User.find({role: "Court"});
    res.status(200).json({
        success: true,
        courts,
    });
  });

  export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });

  // Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Admin Logged Out Successfully.",
      });
  });
  
  // Logout function for frontend user
  export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("userToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "User Logged Out Successfully.",
      });
  });