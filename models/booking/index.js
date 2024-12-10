import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        venue: {
            type: mongoose.Types.ObjectId,
            ref: "venues",
            required: true,
        },
        event_name: {
            type: String,
            required: true,
            trim: true,
        },
        event_desc: {
            type: String,
            required: true,
            trim: true,
        },
        event_start: {
            type: Date,
            required: true,
        },
        event_end: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.event_start;
                },
                message: "Event end time must be after the start time.",
            },
        },
        people_count: {
            type: Number,
            required: true,
            min: 1,
            max: 10000
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "denied", "cancelled"],
            default: "pending",
        },
        event_image: {
            type: String
        },
        requested_update: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        request_note: {
            type: String
        },
        admin_reply_note: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

export const BookingModel = mongoose.model("bookings", BookingSchema);
