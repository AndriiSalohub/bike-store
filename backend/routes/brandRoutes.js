const express = require("express");
const {
  getBrands,
  putBrand,
  getBrand,
  softDeleteBrandRecord,
  postBrand,
  getDeletedBrandsRecord,
  restoreBrandRecord,
} = require("../controllers/brandController");

const router = express.Router();

router.get("/brands", getBrands);
router.get("/deleted_brands", getDeletedBrandsRecord);
router.post("/brands", postBrand);
router.get("/brands/:brand_id", getBrand);
router.put("/brands/:brand_id", putBrand);
router.delete("/brands/:brand_id", softDeleteBrandRecord);
router.put("/brands/restore/:brand_id", restoreBrandRecord);

module.exports = router;
