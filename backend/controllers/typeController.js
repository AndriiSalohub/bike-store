const { getAllTypes } = require("../models/typeModel");

const getTypes = (req, res) => {
  getAllTypes((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку типів.");
    }

    return res.send(data);
  });
};

module.exports = {
  getTypes,
};
