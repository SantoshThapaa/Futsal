import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Court name is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Court location is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Court email is required"],
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Court phone number is required"],
            minLength: [10, "Phone number must contain exactly 10 digits"],
            maxLength: [10, "Phone number must contain exactly 10 digits"],
        },
        pan: {
            type: String,
            required: [true, "Court PAN number is required"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password must contain at least 8 characters"],
        },
        courtAvatar: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        pricing: {
            hourlyRate: {
                type: Number,
                required: true,
                min: [100, "Hourly rate must be at least 100"],
            },
            membershipDiscount: {
                type: Number,
                default: 0, 
            },
        },
        openingHours: {
            startTime: {
                type: String, 
                required: true,
            },
            endTime: {
                type: String, 
                required: true,
            },
        },
        surfaceType: {
            type: String,
            enum: ["Artificial Turf", "Concrete", "Wooden"],
            required: true,
        },
        facilities: {
            type: [String],
            default: ["Changing Rooms", "Parking", "Floodlights"], // Add default facilities
        },
        availability: {
            type: Boolean,
            default: true, // If false, the court is temporarily closed
        },
        blockedSlots: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                startTime: {
                    type: String,
                    required: true,
                },
                endTime: {
                    type: String,
                    required: true,
                },
                reason: {
                    type: String,
                    default: "Maintenance",
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

import bcrypt from "bcrypt";
courtSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

courtSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const Court = mongoose.model("Court", courtSchema);
