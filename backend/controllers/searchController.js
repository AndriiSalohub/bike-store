const { getSearchResults } = require("../models/searchModel");

const getSearchedBikes = (req, res) => {
  const search = req.query.search;
  getSearchResults(search, (err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку велосипедів.");
    }
    return res.send(data);
  });
};

module.exports = {
  getSearchedBikes,
};
