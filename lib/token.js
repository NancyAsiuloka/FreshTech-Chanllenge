const AuthService = require('../services/authService');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

exports.createSendToken = (user, statusCode, res) => {
  const authService = new AuthService(user, res);
  authService.sendResponse(statusCode);
};

exports.getSession = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new AppError('You are not logged in!', 401));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return decoded.id;
    } catch (err) {
      return next(new AppError('Invalid token or session has expired!', 401));
    }
  };
