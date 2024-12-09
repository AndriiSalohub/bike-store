const {
  getAllPromotions,
  getAllCurrentPromoitons,
} = require("../models/promotionModel");

const getPromotions = (req, res) => {
  getAllPromotions((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку знижок.");
    }

    return res.send(data);
  });
};

const getCurrentPromotions = (req, res) => {
  getAllCurrentPromoitons((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні списку поточних знижок.");
    }

    return res.send(data);
  });
};

module.exports = {
  getPromotions,
  getCurrentPromotions,
};
