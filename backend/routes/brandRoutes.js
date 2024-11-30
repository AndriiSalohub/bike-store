const express = require("express");
const {
  getBrands,
  putBrand,
  getBrand,
  deleteBrandRecord,
} = require("../controllers/brandController");

const router = express.Router();

router.get("/brands", getBrands);
router.get("/brands/:brand_id", getBrand);
router.put("/brands/:brand_id", putBrand);
router.delete("/brands/:brand_id", deleteBrandRecord);

module.exports = router;
