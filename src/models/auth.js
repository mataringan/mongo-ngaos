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
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userNgaos", authNgaos);
