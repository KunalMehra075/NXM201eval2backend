const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  pass: String,
  role: {
    type: String,
    enum: ["manager", "customer"],
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = { UserModel };
