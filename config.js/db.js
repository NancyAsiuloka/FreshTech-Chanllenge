require('dotenv').config();
const mongoose = require("mongoose");

module.exports.dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_URL);
    console.info(`Successfully connected to MongoDB: ${process.env.DB_URL.substring(0, 24)}`);
  } catch (error) {
    console.error({
      error: error.message,
      message: `Unable to connect to MongoDB: ${process.env.DB_URL}`,
    });
  }
};
