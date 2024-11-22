const { getAllBikes } = require("../models/bikeModel");

const getBikes = (req, res) => {
  getAllBikes((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку велосипедів.");
    }
    return res.send(data);
  });
};

module.exports = {
  getBikes,
};
