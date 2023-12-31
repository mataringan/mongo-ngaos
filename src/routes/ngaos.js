const express = require("express");
const {
  handleRoot,
  createProduct,
  getAllProduct,
} = require("../controllers/ngaos");
const validator = require("../middleware/validation");
const { register, login, whoami } = require("../controllers/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

router.get("/", handleRoot);

router.post("/product-ngaos", validator, createProduct);

router.get("/product-ngaos", getAllProduct);

router.post("/register", validator, register);

router.post("/login", login);

router.get("/whoami", authorize, whoami);

module.exports = router;
