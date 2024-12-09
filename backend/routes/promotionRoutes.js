const express = require("express");
const {
  getPromotions,
  getCurrentPromotions,
  addPromotion,
  editPromotion,
  removePromotion,
} = require("../controllers/promotionContoller");

const router = express.Router();

router.get("/promotions", getPromotions);
router.get("/current_promotions", getCurrentPromotions);
router.post("/promotions", addPromotion);
router.put("/promotions/:id", editPromotion);
router.delete("/promotions/:id", removePromotion);

module.exports = router;
