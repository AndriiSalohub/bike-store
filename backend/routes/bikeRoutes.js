const express = require("express");
const {
  getBikes,
  getBike,
  putBike,
  softDeleteBikeRecord,
  getBikesWithHighestRating,
  postBike,
  getDeletedBikesRecord,
  restoreBikeRecord,
} = require("../controllers/bikeController");

const router = express.Router();

router.get("/bikes", getBikes);
router.get("/deleted_bikes", getDeletedBikesRecord);
router.post("/bikes", postBike);
router.get("/top-bikes", getBikesWithHighestRating);
router.get("/bikes/:bike_id", getBike);
router.put("/bikes/:bike_id", putBike);
router.delete("/bikes/:bike_id", softDeleteBikeRecord);
router.put("/bikes/restore/:bike_id", restoreBikeRecord);

module.exports = router;
