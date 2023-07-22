const authProduct = require("../models/auth");

module.exports = {
  async findEmail(email) {
    return authProduct.findOne({
      $where: {
        email,
      },
    });
  },
};
