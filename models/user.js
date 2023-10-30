let mongoose = require("mongoose");

let user = mongoose.Schema(
  {
    user_sub: {
      type: String,
      default: null,
      required: true,
    },
    email: {
      type: String,
      default: null,
      required: true,
    },
    password: {
      type: String,
      default: null,
      required: true,
    },
    company_details: {
      type: Object,
      default: null,
      index: true,
    },
    role: {
      type: String,
      default: "Dealer",
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

module.exports = mongoose.model("user", user);
