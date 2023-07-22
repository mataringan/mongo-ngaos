const authNgaos = require("../models/auth");
const jwt = require("jsonwebtoken");

module.exports = {
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );
      req.user = await authNgaos.findById(tokenPayload._id);
      next();
    } catch (error) {
      res.status(401).json({
        message: "Unathorized",
      });
    }
  },
};
