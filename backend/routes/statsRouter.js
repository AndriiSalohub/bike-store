const express = require("express");
const {
  getTypesStatistic,
  getBrandsStatistic,
  getOrdersStat,
  getBikesStatistic,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/statistics/types", getTypesStatistic);
router.get("/statistics/brands", getBrandsStatistic);
router.get("/statistics/orders", getOrdersStat);
router.get("/statistics/bikes", getBikesStatistic);

module.exports = router;
