const express = require("express");
const { getBikes, getBike, putBike } = require("../controllers/bikeController");

const router = express.Router();

router.get("/bikes", getBikes);
router.get("/bikes/:bike_id", getBike);
router.put("/bikes/:bike_id", putBike);

module.exports = router;
