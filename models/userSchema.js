import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: [3, "First Name must contain at least 3 characters"],
        },
        lastName: {
            type: String,
            required: true,
            minLength: [3, "Last Name must contain at least 3 characters"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            minLength: [10, "Phone number must contain exactly 10 digits"],
            maxLength: [10, "Phone number must contain exactly 10 digits"],
        },
        nic: {
            type: String,
            required: true,
            minLength: [13, "NIC must contain exactly 13 characters!"],
            maxLength: [13, "NIC must contain exactly 13 characters!"],
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
        profilePic: {
            type: String,
            default: "default.jpg",
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password must contain at least 8 characters"],
        },
        role: {
            type: String,
            required: true,
            enum: ["Admin", "User"],
            default: "User",
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team",
            },
        ],
        walletBalance: {
            type: Number,
            default: 0, 
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
    );
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
    return resetToken;
};

export const User = mongoose.model("User", userSchema);
