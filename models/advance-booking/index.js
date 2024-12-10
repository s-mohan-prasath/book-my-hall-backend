import mongoose from "mongoose";

const AdvanceBookingSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Types.ObjectId,
            ref: "bookings",
            required: true,
        },
        request_note: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const AdvanceBookingModel = mongoose.model("advancebookings", AdvanceBookingSchema);
