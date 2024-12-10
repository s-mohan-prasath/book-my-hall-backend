import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
    {
        images: [
            {
                url: { type: String, required: true },
                caption: { type: String }
            }
        ]
    },
    {
        timestamps: true,
    }
);

export const ImageModel = mongoose.model("images", ImageSchema);