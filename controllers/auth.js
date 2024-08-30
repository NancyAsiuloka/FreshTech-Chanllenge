const AuthService = require("../services/authService");
const User = require('../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { getSession } = require('../lib/token');
const httpStatus = require("http-status")

class AuthController {
  signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const authService = new AuthService(newUser, res);
    authService.sendResponse(201);
  });

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const authService = new AuthService(user, res);
    authService.sendResponse(200);
  });

  updatePassword = catchAsync(async (req, res, next) => {
    const userId = getSession(req);

    const user = await User.findById(userId).select('+password');

    if (!user || !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('Passwords do not match.', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    res.status(httpStatus.OK).json({
        message: "Updated Successfully",
        data: { user },
      });
  });
}

module.exports = new AuthController();
