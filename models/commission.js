let mongoose = require("mongoose");

let commission = mongoose.Schema(
  {
    type: {
      type: String,
      default: null,
      required: true,
    },
    company: {
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

module.exports = mongoose.model("commission", commission);
