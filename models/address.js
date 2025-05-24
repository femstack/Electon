const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  addedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Useraccount",
  },
  country: {
    type: String,
  },
  companyname: {
    type: String,
  },
  city: {
    type: String,
  },
  streetaddress: {
    type: String,
  },
  address: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  state: {
    type: String,
  },
  apartment:{
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Address", addressSchema);