import express from "express";

import { AdminUserModel } from "../../../models/allModels.js";
import { ValidateAdminSignIn } from "../../../validate/auth.validate.js";

const Router = express.Router();

/**
 * Route    /signin
 * Des       Login to existing Admin Account
 * Params    none
 * Access    Public
 * Method    POST
 */

Router.post("/signin", async (req, res) => {
    let credentials = req.body;
    try {
        await ValidateAdminSignIn(credentials);
        const user = await AdminUserModel.findByEmailAndPassword(credentials);
        const token = await user.generateJwtToken();
        res.status(200).json({ token, status: "success", token, admin_user: user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

export default Router;

// Getting Error ===> "error": "Cannot destructure property 'email' of 'undefined' as it is undefined."