const ProductNgaos = require("../models/ngaos");

exports.handleRoot = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is up and running!!",
  });
};

exports.createProduct = (req, res) => {
  const { name, description, image, category, price } = req.body;

  const addProduct = new ProductNgaos({
    name,
    description,
    image,
    category,
    price,
  });

  addProduct
    .save()
    .then((result) => {
      res.status(201).json({
        status: "success",
        message: "Create Product Success",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
