const { queryDatabase } = require("../db/db");

const getAllBikes = (callback) => {
  const query = "SELECT * FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

module.exports = { getAllBikes };
