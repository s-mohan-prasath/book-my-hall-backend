import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const ROLE_TYPES = {
    ROOT: "root",         // Full access, including admin management
    MANAGER: "manager",   // Manage users, bookings, and other major data
    VIEW_ONLY: "view-only" // Read-only access to view data
};
// Admin User Schema
const AdminUserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true, trim: true },
        type: {
            type: String,
            enum: Object.values(ROLE_TYPES),
            default: ROLE_TYPES.VIEW_ONLY,
            required: true,
            trim: true,
            lowercase: true,
        },
        roleUpdatedAt: { type: Date, default: Date.now }, // Track role updates
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// JWT Token Generation
AdminUserSchema.methods.generateJwtToken = function () {
    return jwt.sign(
        { admin_id: this._id.toString(), type: this.type },
        process.env.APP_SECRET,
        { expiresIn: "1d" }
    );
};

// Static Helper Methods
AdminUserSchema.statics.findByEmail = async ({ email }) => {
    const user = await AdminUserModel.findOne({ email });
    if (user) {
        throw new Error("Admin user with this email already exists.");
    }
    return false;
};

AdminUserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
    const user = await AdminUserModel.findOne({ email });
    if (!user) {
        throw new Error("Admin user does not exist.");
    }

    // Compare stored hashed password with the entered password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
        throw new Error("Invalid password.");
    }
    user.password = null
    return user;
};

// Helper Method to Update Role
AdminUserSchema.methods.updateRole = async function (newRole) {
    if (!Object.values(ROLE_TYPES).includes(newRole)) {
        throw new Error(`Invalid role: ${newRole}`);
    }

    this.type = newRole;
    this.roleUpdatedAt = Date.now();
    await this.save();
    return this;
};

// Pre-save Middleware for Password Hashing
AdminUserSchema.pre("save", function (next) {
    const user = this;

    // If the password hasn't been modified, skip hashing
    if (!user.isModified("password")) return next();

    // Generate bcrypt salt and hash the password
    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            user.password = hash; // Assign hashed password
            next();
        });
    });
});

export const AdminUserModel = mongoose.model("admin-users", AdminUserSchema);
