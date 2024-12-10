import express from "express";

import { UserModel } from "../../models/allModels.js";
import { ValidateSignIn, ValidateSignUp } from "../../validate/auth.validate.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()

const Router = express.Router();
/**
 * Route    /auth/verify-token
 * Des       Verify the token's validity
 * Params    none
 * Access    Public
 * Method    GET
 */
Router.get("/verify-token", async (req, res) => {
    const { token } = req.query;  // Extract token from the query params

    if (!token) {
        return res.status(400).json({ error: "No token provided" });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.APP_SECRET);  // Verify token with your secret key
        console.log(process.env.APP_SECRET)
        if (decoded?.user_id || decoded?.admin_id) {
            return res.status(200).json({ status: "success", message: "Token is valid" });
        } else {
            throw new Error("User not found")
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


/**
 * Route    /signup
 * Des       create new authorised user
 * Params    none
 * Access    Public
 * Method    POST
 */
Router.post("/signup", async (req, res) => {
    let credentials = req.body;
    try {
        const { email, password, name, phoneNumber } = credentials;
        await ValidateSignUp(credentials);
        const user = await UserModel.findOne({ email });
        if (user) throw new Error("User Already Exists");
        const newUser = await UserModel.create({ email, password, name, phoneNumber });
        const token = newUser.generateJwtToken();
        return res.status(200).json({ status: "success", token, user: newUser });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * Route    /signin
 * Des       Login to existing Account
 * Params    none
 * Access    Public
 * Method    POST
 */

Router.post("/signin", async (req, res) => {
    let credentials = req.body;
    try {
        await ValidateSignIn(credentials);
        const user = await UserModel.findByEmailAndPassword(credentials);
        const token = await user.generateJwtToken();
        res.status(200).json({ status: "success", token, user });
    } catch (error) {
        return res.status(400).json({ error: error.message, });
    }
});

export default Router;

// Getting Error ===> "error": "Cannot destructure property 'email' of 'undefined' as it is undefined."