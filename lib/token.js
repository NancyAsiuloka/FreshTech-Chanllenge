const AuthService = require('../services/authService');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

exports.createSendToken = (user, statusCode, res) => {
  const authService = new AuthService(user, res);
  authService.sendResponse(statusCode);
};

exports.getSession = (req) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('You are not logged in!', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};
