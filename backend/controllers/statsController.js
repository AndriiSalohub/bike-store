const {
  getAllTypesStatistic,
  getAllBrandsStatistic,
  getOrdersStatistic,
  getPopularBikesStatistic,
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

const getOrdersStat = (req, res) => {
  getOrdersStatistic((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні статистики про замовлення.");
    }

    return res.send(data);
  });
};

const getBikesStatistic = (req, res) => {
  getPopularBikesStatistic((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні статистики про велосипеди.");
    }

    return res.send(data);
  });
};

module.exports = {
  getTypesStatistic,
  getBrandsStatistic,
  getOrdersStat,
  getBikesStatistic,
};
