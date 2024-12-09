const express = require("express");
const {
  getPromotions,
  getCurrentPromotions,
} = require("../controllers/promotionContoller");

const router = express.Router();

router.get("/promotions", getPromotions);
router.get("/current_promotions", getCurrentPromotions);

module.exports = router;
