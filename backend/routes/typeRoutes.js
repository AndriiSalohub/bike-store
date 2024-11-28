const express = require("express");
const { getTypes } = require("../controllers/typeController");

const router = express.Router();

router.get("/types", getTypes);

module.exports = router;
