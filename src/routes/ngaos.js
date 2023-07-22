const express = require("express");
const {
  handleRoot,
  createProduct,
  getAllProduct,
} = require("../controllers/ngaos");
const validator = require("../middleware/validation");

const router = express.Router();

router.get("/", handleRoot);

router.post("/product-ngaos", validator, createProduct);

router.get("/product-ngaos", getAllProduct);
module.exports = router;
