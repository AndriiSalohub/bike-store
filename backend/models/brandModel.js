const { queryDatabase } = require("../db/db");

const getAllBrands = (callback) => {
  const query = "SELECT * FROM bike_store.brand";

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllBrands,
};
