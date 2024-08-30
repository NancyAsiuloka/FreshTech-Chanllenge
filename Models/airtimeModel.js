const mongoose = require('mongoose');
const crypto = require("crypto");

const airtimeSchema =  new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  network: {
    type: String,
    required: true,
    enum: ['MTN', 'Glo', 'Airtel', '9mobile'],
  },
  amount: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^(\+?\d{1,3}[- ]?)?\d{10}$/
  },
  airtimeSharePin: {
    type: String,
  },
  transaction: {
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction',
  },
  date: {
    type: Date,
    default: Date.now
  }
});

airtimeSchema.pre("save", function (next) {
    if (this.isNew && !this. airtimeSharePin) {
      const length = 8;
      const randomCode = crypto
        .randomBytes(length)
        .toString("hex")
      this. airtimeSharePin = randomCode;
    }
    next();
  });

airtimeSchema.methods.generateAirtimeSharePin = function () {
    return `${this.airtimeSharePin}`;
  };

const Airtime = mongoose.model('Airtime', airtimeSchema);

module.exports = Airtime;
