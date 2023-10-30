const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = connection;
