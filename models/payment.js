const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  cart: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
      },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    },
  ],
  paymenttype: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  orderNum: {
    type: String,
    required: true,
    unique: true,
  },
  trxref: {
    type: String,
  },
  channel: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  Paid_at: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
