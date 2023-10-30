let mongoose = require("mongoose");

let carModel = mongoose.Schema(
  {
    brand: {
      type: String,
      default: null,
      index: true,
    },
    model: {
      type: String,
      default: null,
      index: true,
    },
    version: {
      type: String,
      default: null,
      index: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("car_model", carModel);
