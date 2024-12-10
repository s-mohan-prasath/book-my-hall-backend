import express from "express";
import passport from 'passport'
import { BookingModel } from "../../../models/allModels.js";
import { ValidateAdminUpdateBooking } from "../../../validate/booking.validate.js";

const Router = express.Router();

/**
 * Route    /admin/booking
 * Des       get list of bookings in admin side
 * Params    none
 * Access    Private
 * Method    GET
 */
Router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let bookings = await BookingModel.find().populate("venue")
        return res.json({ message: "bookings retrieved successfully", "bookings": bookings })
    } catch (error) {
        return res.status(404).json({ status: "failed", error: error.message });
    }
});

/**
 * Route    /admin/booking/difjewifjdsijf
 * Des       update booking by id
 * Params    none
 * Access    Private
 * Method    PATCH
 */
Router.patch("/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let bookingData = req.body;
        let { _id } = req.params
        await ValidateAdminUpdateBooking(bookingData)
        let updatedBooking = await BookingModel.updateOne({ _id }, { ...bookingData })
        return res.json({ message: "bookings retrieved successfully", "booking": updatedBooking })
    } catch (error) {
        return res.status(404).json({ status: "failed", error: error.message });
    }
});

export default Router;
