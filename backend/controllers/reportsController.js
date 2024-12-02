const { getSalesReport, getQuantityReport } = require("../models/reportsModel");

const getSalesReportForPeriod = (req, res) => {
  getSalesReport((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при звіту про продажу велосипедів за період.");
    }

    return res.send(data);
  });
};

const getCurrentQuantityReport = (req, res) => {
  getQuantityReport((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні звіту про велосипеди з малою кількістю.");
    }

    return res.send(data);
  });
};

module.exports = {
  getSalesReportForPeriod,
  getCurrentQuantityReport,
};
