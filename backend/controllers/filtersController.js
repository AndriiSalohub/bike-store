const {
  getDistinctGenders,
  getDistinctWheelSizes,
  getDistinctColors,
  getMinMaxPrice,
  getMinMaxBikeWeight,
} = require("../models/filtersModel");

const getGenders = (req, res) => {
  getDistinctGenders((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні cтатей.");
    }

    return res.send(data);
  });
};

const getWheelSizes = (req, res) => {
  getDistinctWheelSizes((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні розмірів колес.");
    }

    return res.send(data);
  });
};

const getColors = (req, res) => {
  getDistinctColors((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні кольорів.");
    }

    return res.send(data);
  });
};

const getPriceLimits = (req, res) => {
  getMinMaxPrice((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при мінімальної і максимальної ціни.");
    }

    return res.send(data);
  });
};

const getWeightLimits = (req, res) => {
  getMinMaxBikeWeight((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при максимальної і мінімальної ваги велосипеда.");
    }

    return res.send(data);
  });
};

module.exports = {
  getGenders,
  getWheelSizes,
  getColors,
  getPriceLimits,
  getWeightLimits,
};
