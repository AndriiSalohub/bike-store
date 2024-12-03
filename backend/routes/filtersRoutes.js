const express = require("express");
const {
  getGenders,
  getWheelSizes,
  getColors,
} = require("../controllers/filtersController");
const router = express.Router();

router.get("/genders", getGenders);
router.get("/wheel_sizes", getWheelSizes);
router.get("/colors", getColors);

module.exports = router;
