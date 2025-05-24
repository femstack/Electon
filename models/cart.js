const mongoose = require("mongoose");

const cartschema = new mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Useraccount",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: Number,
  checkedout: {
    type: Boolean,
    default: false,
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("cart", cartschema);
