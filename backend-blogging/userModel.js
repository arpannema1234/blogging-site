const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the blog schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

// Create the blog model
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
