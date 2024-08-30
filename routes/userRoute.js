const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();

// ROUTES FOR USERS
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/dashboard', userController.getDashboardData)
router.get('/', userController.getUser)
router.post('/buy-airtime', userController.buyAirtime)
router.get('/transaction-history', userController.getTransactionHistory)
router.patch('/update-password', authController.updatePassword)

module.exports = router;