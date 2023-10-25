const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["trader", "company"],
    required: true,
  },
  companyName: {
    type: String,
    required: function () {
      return this.role === "company";
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
