const {
  getAllTypesStatistic,
  getAllBrandsStatistic,
} = require("../models/statsModel");

const getTypesStatistic = (req, res) => {
  getAllTypesStatistic((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні статистики про типи.");
    }

    return res.send(data);
  });
};

const getBrandsStatistic = (req, res) => {
  getAllBrandsStatistic((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні статистики про бренди.");
    }

    return res.send(data);
  });
};

module.exports = {
  getTypesStatistic,
  getBrandsStatistic,
};
