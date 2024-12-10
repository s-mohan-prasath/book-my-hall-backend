import mongoose from "mongoose";

// Make the user sign in faster enough so that user won't feel bore.
const VenueSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },// classroom | lab | hall
        seating_capacity: { type: Number, required: true },
        has_projector: { type: Boolean, default: false },
        has_ac: { type: Boolean, default: false },
        has_podium: { type: Boolean, default: false },
        address: { type: String, required: true },
        image: {
            type: mongoose.Types.ObjectId,
            ref: "images",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const VenueModel = mongoose.model("venues", VenueSchema);