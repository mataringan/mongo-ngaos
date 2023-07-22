const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authNgaos = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("authNgaos", authNgaos);
