const mongoose = require("mongoose");
const { mongoURL } = require("./config");
mongoose.connect(mongoURL);

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  password: { type: String, required: true, minLength: 2 },
  username: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: mongoose.Number, required: true },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
