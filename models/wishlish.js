const mongoose = require("mongoose");

const wishlishschema = new mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Useraccount",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("wishlish", wishlishschema);
