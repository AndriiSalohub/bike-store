const {
  getAllPromotions,
  getAllCurrentPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require("../models/promotionModel");

const getPromotions = (req, res) => {
  getAllPromotions((err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching promotions" });
    }
    return res.json(data);
  });
};

const getCurrentPromotions = (req, res) => {
  getAllCurrentPromotions((err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching current promotions" });
    }
    return res.json(data);
  });
};

const addPromotion = (req, res) => {
  const promotionData = req.body;
  console.log(req.body);

  createPromotion(promotionData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error creating promotion" });
    }
    return res.status(201).json({
      message: "Promotion created successfully",
      promotionId: result.insertId,
    });
  });
};

const editPromotion = (req, res) => {
  const { id } = req.params;
  const promotionData = req.body;

  updatePromotion(id, promotionData, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error updating promotion" });
    }
    return res.json({ message: "Promotion updated successfully" });
  });
};

const removePromotion = (req, res) => {
  const { id } = req.params;
  deletePromotion(id, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting promotion" });
    }
    return res.json({ message: "Promotion deleted successfully" });
  });
};

module.exports = {
  getPromotions,
  getCurrentPromotions,
  addPromotion,
  editPromotion,
  removePromotion,
};
