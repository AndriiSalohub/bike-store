const { queryDatabase } = require("../db/db");

const getDistinctGenders = (callback) => {
  const query = "SELECT DISTINCT gender FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

const getDistinctWheelSizes = (callback) => {
  const query = "SELECT DISTINCT wheel_size FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

const getDistinctColors = (callback) => {
  const query = "SELECT DISTINCT bike_color FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

module.exports = {
  getDistinctGenders,
  getDistinctWheelSizes,
  getDistinctColors,
};
