const mongoose = require("mongoose");


const connectDB = () => {
  const mongoose = require("mongoose");

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
};

module.exports = connectDB;
