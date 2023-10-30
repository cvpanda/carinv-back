let mongoose = require("mongoose");

let cityState = mongoose.Schema({
    city: {
      type: String,
      default: null,
      required: true,
    },
    region: {
      type: String,
      default: null,
      required: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("city_state", cityState);
