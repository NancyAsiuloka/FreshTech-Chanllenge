const User = require("../Models/userModel");
const Airtime = require("../Models/airtimeModel");
const Transaction = require("../Models/transactionModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const { getSession } = require("../lib/token");

class UserController {
  getDashboardData = catchAsync(async (req, res, next) => {
    const userId = getSession(req);
    const user = await User.findById(userId);

    if (!user) return next(new AppError('No user found', 404));

    const { totalWalletBalance, walletBalance, referrals } = user;
    const referralLink = user.generateReferralLink();

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: {
        totalWalletBalance,
        currentWalletBalance: walletBalance,
        referralLink,
        totalReferrals: referrals.length,
      },
    });
  });

  getUser = catchAsync(async (req, res, next) => {
    const userId = getSession(req);
    const user = await User.findById(userId);

    if (!user) return next(new AppError('No user found', 404));

    res.status(200).json({
      message: "Success",
      data: { user },
    });
  });

  buyAirtime = catchAsync(async (req, res, next) => {
    const { network, amount, phoneNumber, airtimeSharePin } = req.body;
    const userId = getSession(req);

    if (!network || !amount || !phoneNumber) {
      return next(new AppError('All fields are required', 400));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError('No user found', 404));

    const airtime = await Airtime.create({ userId, network, amount, phoneNumber, airtimeSharePin });
    const transaction = await Transaction.create({
      service: airtime._id,
      userId,
      amount,
      status: "Initiated",
      payment_method: "Transfer",
      actions: "Open",
      date: new Date(),
    });

    res.status(201).json({
      message: "Airtime purchased successfully",
      data: { airtime, transaction },
    });
  });

  getTransactionHistory = catchAsync(async (req, res, next) => {
    const userId = getSession(req);

    const user = await User.findById(userId);
    if (!user) return next(new AppError('No user found', 404));

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 14;

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Transaction history fetched successfully",
      data: { transactions, currentPage: page },
    });
  });
}

module.exports = new UserController();
