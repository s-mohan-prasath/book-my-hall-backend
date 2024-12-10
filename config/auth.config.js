import JwtPassport from "passport-jwt";
import { config } from "dotenv";
import { AdminUserModel, UserModel } from "../models/allModels.js"

config()
const JWtStrategy = JwtPassport.Strategy;
const ExtractJWT = JwtPassport.ExtractJwt;

/**
 * head{
 *  Authorization: "Bearer: wpipffhewae08gewr80tyery08eyg"
 * }
 */

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_SECRET,
};

export default (passport) => {
    passport.use(
        new JWtStrategy(options, async (jwt__payloads, done) => {
            if (jwt__payloads.user_id) {
                try {
                    const user = await UserModel.findById(jwt__payloads.user_id);
                    if (!user) return done(null, false);
                    return done(null, { user_id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber });
                } catch (error) {
                    throw new Error(error);
                }
            } else if (jwt__payloads.admin_id) {
                try {
                    const admin = await AdminUserModel.findById(jwt__payloads.admin_id);
                    if (!admin) return done(null, false);
                    return done(null, { admin_id: admin._id, name: admin.name, email: admin.email, phoneNumber: admin.phoneNumber, type: admin.type });
                } catch (error) {
                    throw new Error(error);
                }
            } else {
                throw new Error("Invalid jwt token")
            }
        })
    )
};