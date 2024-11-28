const { getAllBrands } = require("../models/brandModel");

const getBrands = (req, res) => {
  getAllBrands((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку брендів.");
    }

    return res.send(data);
  });
};

module.exports = {
  getBrands,
};
