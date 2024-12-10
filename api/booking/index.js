import express from "express";
import passport from 'passport'
import { BookingModel } from "../../models/allModels.js";
import { ValidateNewBooking, ValidateUpdateBooking } from "../../validate/booking.validate.js";
import { isBookingAvailable } from './../../utils/db.js'

const Router = express.Router();

/**
 * Route    /booking/user
 * Des       get list of bookings of the particular user
 * Params    none
 * Access    Private
 * Method    GET
 */
Router.get("/user", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let user_id = req.user?.user_id;
        let bookings = await BookingModel.find({ user: user_id }).populate("venue")
        return res.json({ message: "bookings retrieved successfully", "bookings": bookings })
    } catch (error) {
        return res.status(404).json({ status: "failed", error: error.message });
    }
});
/**
 * Route    /booking/venue?id=djfidsjfidj
 * Des       get list of bookings of the particular venue
 * Params    none
 * Query     id
 * Access    Private
 * Method    GET
 */
Router.get(
    "/venue",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) {
                throw new Error("Venue Id is required to retrieve the bookings")
            }
            const bookings = await BookingModel.find({
                venue: id, status: "accepted"
            }).populate("venue");
            return res.json({
                message: "Bookings retrieved successfully",
                bookings: bookings,
            });
        } catch (error) {
            return res.status(400).json({
                status: "failed",
                error: error.message,
            });
        }
    }
);
/**
 * Route    /booking
 * Des       create new booking
 * Params    none
 * Access    Private
 * Method    POST
 */
Router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let user_id = req.user?.user_id
        let bookingData = req.body;
        await ValidateNewBooking(bookingData)
        let availBookingsArrLen = await isBookingAvailable(bookingData?.venue, new Date(bookingData?.event_start), new Date(bookingData?.event_end));
        if (availBookingsArrLen != 0) {
            throw new Error("Booking slot unavailable in the given start and end time of the event")
        }
        bookingData.user = user_id;
        let booking = await BookingModel.create(bookingData)
        res.json({ message: "Booking created successfully...", booking })
    } catch (e) {
        return res.status(400).json({ status: "failed", error: e.message })
    }
})
// TODO: work on the route
Router.patch("/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {

    } catch (e) {
        return res.status(400).json({ status: "failed", error: e.message })
    }
})


export default Router;
