const { required } = require("joi");
const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String, // e.g. "July 14, 2025"
    default: () => new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
  },
});


const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  image: [
    {
      type: String,
      required: true,
    },
  ],
  date: {
    type: Date,
  },

  comments: [commentSchema],
});

module.exports = mongoose.model("Blog", blogSchema);
