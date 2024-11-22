const express = require("express");
const { getBikes } = require("../controllers/bikeController");

const router = express.Router();

router.get("/bikes", getBikes);

module.exports = router;
