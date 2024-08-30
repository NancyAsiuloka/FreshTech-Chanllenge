const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Airtime',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['Initiated', 'Successfull', 'Failed'],
    default: 'Initiated'
  },
  payment_method: {
    type: String,
    enum: ['Transfer', 'card-payment', 'wallet'],
    default: 'Transfer'
  },
  actions: {
    type: String,
    default: 'Open'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
