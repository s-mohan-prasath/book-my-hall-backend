import express from 'express'
import passport from 'passport'
import { UserModel } from '../../../models/user/index.js'

const Router = express()

/**
 * Route    /admin/users
 * Des       get list of users
 * Params    none
 * Access    private
 * Method    GET
 */

Router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let users = await UserModel.find().select("-password");
        return res.json({ users, message: "users retrieved successfully" }).status(200)
    } catch (e) {
        res.status(400).json({ error: e.message, status: "failed" })
    }
})

export default Router