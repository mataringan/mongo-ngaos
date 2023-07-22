const ProductNgaos = require("../models/ngaos");
const cloudinary = require("./cloudinary");
const path = require("path");
exports.handleRoot = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is up and running!!",
  });
};

exports.createProduct = (req, res) => {
  const { name, description, category, price } = req.body;

  if (req.file == null) {
    res.status(400).json({
      status: "failed",
      message: "you must input image",
    });
    return;
  } else {
    const fileBase64 = req.file.buffer.toString("base64");
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;

    cloudinary.uploader.upload(
      file,
      { folder: "product-ngaos" },
      async function (err, result) {
        if (!!err) {
          res.status(400).json({
            status: "upload fail",
            errors: err.message,
          });
          return;
        }

        const AddProduct = new ProductNgaos({
          name,
          description,
          image: result.url,
          category,
          price,
        });

        AddProduct.save()
          .then((result) => {
            res.status(201).json({
              message: "Create Product Success",
              data: result,
            });
          })

          .catch((err) => {
            console.log(err);
          });
      }
    );
  }
};
