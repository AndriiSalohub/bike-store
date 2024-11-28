const { queryDatabase } = require("../db/db");

const getAllTypes = (callback) => {
  const query = "SELECT * FROM bike_store.type";

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllTypes,
};
