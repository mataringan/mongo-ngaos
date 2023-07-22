const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authNgaos = require("../models/auth");
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

      const createUser = await authNgaos.create({
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
    } else {
      const fileBase64 = req.file.buffer.toString("base64");
      const file = `data:${req.file.mimetype};base64,${fileBase64}`;

      cloudinary.uploader.upload(
        file,
        {
          folder: "user-ngaos",
        },
        async function (err, result) {
          if (!!err) {
            res.status(400).json({
              status: "Upload Fail",
              errors: err.message,
            });
            return;
          }

          const createUser = await authNgaos.create({
            name,
            email,
            password,
            email,
            phone,
            image: result.url,
            role: "user",
          });

          res.status(201).json({
            status: "success",
            data: createUser,
          });
        }
      );
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await authNgaos.findOne({
      email,
    });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "email not found",
      });
      return;
    }

    const isPasswordCorrect = await checkPassword(user.password, password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        status: "error",
        message: "Password Salah!",
      });
      return;
    }
    const token = createToken({
      _id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });

    res.status(201).json({
      token: token,
      email: user.email,
      role: user.role,
    });
  },
};
