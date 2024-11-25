const express = require("express");
const {
  getTypesStatistic,
  getBrandsStatistic,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/statistics/types", getTypesStatistic);
router.get("/statistics/brands", getBrandsStatistic);

module.exports = router;
