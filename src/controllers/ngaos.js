const ProductNgaos = require("../models/ngaos");
const cloudinary = require("./cloudinary");
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

        ProductNgaos.create({
          name,
          description,
          image: result.url,
          category,
          price,
        })
          .then((result) => {
            res.status(201).json({
              status: "success",
              message: "Create Product Success",
              data: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              status: "failed",
              message: err,
            });
          });
      }
    );
  }
};

exports.getAllProduct = async (req, res) => {
  const findAll = () => {
    return ProductNgaos.find();
  };
  try {
    const dataProduct = await findAll();
    if (dataProduct.length === 0) {
      res.status(200).json({
        status: "failed",
        message: "Data is empty",
        data: [],
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Get All Data Product Success",
      data: dataProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
