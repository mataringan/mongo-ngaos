const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authProduct = require("../models/auth");
const cloudinary = require("./cloudinary");
const { findEmail } = require("./email");
const salt = 10;

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, encryptedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
}

function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(isPasswordCorrect);
    });
  });
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
}

module.exports = {
  async register(req, res) {
    const password = await encryptPassword(req.body.password);
    const { name, email, phone } = req.body;
    if (req.file == null) {
      // check email and password is not empty
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password is required",
        });
      }

      // validator email format using regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Email format is invalid",
        });
      }

      // check if email already exist
      const emailUser = await findEmail(email);
      if (emailUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already Exist",
          data: {},
        });
      }

      const createUser = await authProduct.create({
        name,
        email,
        phone,
        password,
        role: "user",
      });

      res.status(201).json({
        status: "success",
        message: "register success",
        data: createUser,
      });
    }
  },
};