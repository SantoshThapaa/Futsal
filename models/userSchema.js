import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:[3, "First Name must contain atleast 3 characters"]
    },
    lastName:{
        type: String,
        required: true,
        minLength:[3, "First Name must contain atleast 3 characters"]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide a Valid Email"]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10, "Phone Number Must contain exact 10 digits"],
        maxLength: [10, "Phone Number Must contain exact 10 digits"],
    },
    nic:{
        type: String,
        required: true,
        minLength: [13, "NIC Must contain exact 13 characters!"],
        maxLength: [13, "NIC Number Must contain exact 13 digits"],
    },
    gender:{
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    password:{
        type: String,
        minLength: [8, "Password must contain atleast 8 characters"],
        required: true
    }
});
export const User= mongoose.model("User", userSchema);