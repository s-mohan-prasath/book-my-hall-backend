import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()
// Make the user sign in faster enough so that user won't feel bore.
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// attachments

UserSchema.methods.generateJwtToken = function () {
  return jwt.sign({ user_id: this._id.toString() }, process.env.APP_SECRET, { expiresIn: "1d" });
};

// helper functions

UserSchema.statics.findByEmail = async ({ email }) => {
  const checkUserByEmail = await UserModel.findOne({ email });
  if (checkUserByEmail) {
    throw new Error("User Already Exists ...!");
  }
  return false;
};

UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User does not exist !!! ");

  // Comparing Stored & Encrypted Password and (Encrypting user filled password)
  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) throw new Error("Invalid Password !!!");
  user.password = null
  return user;
};

UserSchema.pre("save", function (next) {
  const user = this;
  // generate bcrypt salt
  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);
    // hash the password
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      // assigning hashed password
      user.password = hash;
      return next();
    });
  });
});

export const UserModel = mongoose.model("users", UserSchema);