const express = require("express");
const {
  getFeatures,
  getFeature,
  postFeature,
  putFeature,
  deleteFeaturesHandler,
  getBikeFeatures,
} = require("../controllers/featureContoller");

const router = express.Router();

router.get("/features", getFeatures);
router.get("/features/:feature_id", getFeature);
router.post("/features", postFeature);
router.put("/features/:feature_id", putFeature);
router.delete("/features/:feature_id", deleteFeaturesHandler);
router.get("/bike-features/:bike_id", getBikeFeatures);

module.exports = router;
