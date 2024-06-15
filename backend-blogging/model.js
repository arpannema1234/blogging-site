const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the blog schema
const blogSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  title: { type: String, required: true },
  images: { type: String, required: true },
  comments: [{ user: String, comment: String }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvoteIds: [{ type: String, default: [] }],
  downvoteIds: [{ type: String, default: [] }],
  date: { type: Date, default: Date.now() },
});

// Create the blog model
const Blogs = mongoose.model("Blogs", blogSchema);
module.exports = Blogs;
