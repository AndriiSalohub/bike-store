const express = require("express");
const {
  getBikes,
  getBike,
  putBike,
  deleteBikeRecord,
  getBikesWithHighestRating,
} = require("../controllers/bikeController");

const router = express.Router();

router.get("/bikes", getBikes);
router.get("/top-bikes", getBikesWithHighestRating);
router.get("/bikes/:bike_id", getBike);
router.put("/bikes/:bike_id", putBike);
router.delete("/bikes/:bike_id", deleteBikeRecord);

module.exports = router;
