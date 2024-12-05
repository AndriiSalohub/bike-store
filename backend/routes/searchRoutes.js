const express = require("express");
const { getSearchedBikes } = require("../controllers/searchController");
const router = express.Router();

router.get("/searched_bikes", getSearchedBikes);

module.exports = router;
