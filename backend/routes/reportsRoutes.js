const express = require("express");
const {
  getSalesReportForPeriod,
  getCurrentQuantityReport,
} = require("../controllers/reportsController");

const router = express.Router();

router.get("/reports/sales", getSalesReportForPeriod);
router.get("/reports/quantity", getCurrentQuantityReport);

module.exports = router;
