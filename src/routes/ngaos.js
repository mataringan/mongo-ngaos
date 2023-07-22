const express = require("express");
const { handleRoot, createProduct } = require("../controllers/ngaos");
const validator = require("../middleware/validation");

const router = express.Router();

router.get("/", handleRoot);

router.post("/product-ngaos", validator, createProduct);
module.exports = router;
