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
  const image = req.file;

  // upload gambar ke cloudinary
  cloudinary.uploader.upload(image.path, (error, result) => {
    if (error) {
      console.log("Upload gambar gagal:", error);
      return res.status(500).json({ message: "Upload gambar gagal" });
    }

    // Ambil URL gambar yang diunggah dari hasil upload Cloudinary
    const imageUrl = result.secure_url;

    const addProduct = new ProductNgaos({
      name,
      description,
      image: imageUrl,
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
        res.status(500).json({
          status: "failed",
          message: err,
        });
      });
  });
};
