import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorhandler.js";

import User from "../models/user.js";
import cloudinary from "cloudinary";
import sendJWTToken from "../utils/jwtToken.js";

//Register user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is sample id",
      url: "profilePicUrl",
    },
  });

  sendJWTToken(user, 200, res);
  // const token = user.getJWTToken();

  // res.status(201).json({
  //   success: true,
  //   token,
  // });
});

//login user
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given email and password both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password"), 401);
  }

  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password"), 401); //don't give exact information.
  }

  sendJWTToken(user, 201, res);
  // const token = user.getJWTToken();

  // res.status(201).json({
  //   success: true,
  //   token,
  // });
});

//logout user
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

//forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();
  //its necessary to save bcoz user was already created but after passing resetPasswordToken to userSchema we have to save it.
  await user.save();
});
