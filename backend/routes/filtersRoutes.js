const express = require("express");
const {
  getGenders,
  getWheelSizes,
  getColors,
  getPriceLimits,
  getWeightLimits,
} = require("../controllers/filtersController");
const router = express.Router();

router.get("/genders", getGenders);
router.get("/wheel_sizes", getWheelSizes);
router.get("/colors", getColors);
router.get("/price_limits", getPriceLimits);
router.get("/weight_limits", getWeightLimits);

module.exports = router;
