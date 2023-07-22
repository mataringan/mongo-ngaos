const express = require("express");
const { handleRoot, createProduct } = require("../controllers/ngaos");
const router = express.Router();

router.get("/", handleRoot);

router.post("/product-ngaos", createProduct);
module.exports = router;
