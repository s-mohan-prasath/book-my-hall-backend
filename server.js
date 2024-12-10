import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import dotenv from "dotenv"
import session from 'express-session'
import passport from 'passport'

import { UserModel, VenueModel, ImageModel, BookingModel, AdvanceBookingModel } from './models/allModels.js'
import privateRouteConfig from './config/auth.config.js'
import Auth from './api/auth/index.js'
import Image from './api/image/index.js'
import Venue from './api/venue/index.js'
import AdminVenue from './api/admin/venue/index.js'
import AdminAuth from './api/admin/auth/index.js'
import Booking from './api/booking/index.js'
import AdminUsers from './api/admin/users/index.js'
import AdminBooking from './api/admin/booking/index.js'

dotenv.config()
const app = express()

privateRouteConfig(passport)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
app.use(session({ secret: process.env.APP_SECRET }))
app.use(passport.initialize())
app.use(passport.session())


app.get("/", (req, res) => {
    res.json({
        message: "coming"
    })
})

app.use("/auth", Auth)
app.use("/admin/auth", AdminAuth)
app.use("/get-image", Image)
app.use("/venue", Venue)
app.use("/admin/venue", AdminVenue)
app.use("/booking", Booking)
app.use("/admin/users", AdminUsers)
app.use("/admin/booking", AdminBooking)

let PORT = 5000
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("connected to database"), (error) => console.log("DATABASE CONNECTION ERROR : " + error.message))
    console.log("Server is listening on " + PORT)
})