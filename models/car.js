const mongoose = require("mongoose");

let car = mongoose.Schema(
  {
    brand: {
      type: String,
      default: null,
      index: true,
    },
    model: {
      type: String,
      default: null,
      required: true,
    },
    Year: {
      type: String,
      default: null,
      required: true,
    },
    millage: {
      type: String,
      default: null,
      index: true,
    },
    version: {
      type: String,
      default: null,
      index: true,
    },
    purchase_price: {
      type: Number,
      default: null,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    image: {
      type: String,
      default: null,
      index: true,
    },
    purchase_date: {
      type: Date,
      default: null,
      index: true,
    },
    license_number: {
      type: String,
      default: null,
      index: true,
    },
    charges_items: {
      type: Array,
      default: [],
      index: true,
    },
    charges_amount: {
      type: Number,
      default: null,
      index: true,
    },
    status: {
      type: String,
      default: null,
      index: true,
    },
    publish_date: {
      type: Date,
      default: null,
      index: true,
    },
    inventory: {
      type: Number,
      default: null,
      index: true,
    },
    inspection_date: {
      type: Date,
      default: null,
      index: true,
    },
    sell_date: {
      type: Date,
      default: null,
      index: true,
    },
    published_price: {
      type: Number,
      default: null,
      index: true,
    },
    sell_executive: {
      type: String,
      default: null,
      index: true,
    },
    margin: {
      type: Number,
      default: null,
      index: true,
    },
    charges_items: {
      type: Array,
      default: [],
      index: true,
    },
    commission_items: {
      type: Array,
      default: [],
      index: true,
    },
    payment_method: {
      type: Array,
      default: [],
      index: true,
    },
    selling_price: {
      type: Number,
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

module.exports = mongoose.model("car", car);
