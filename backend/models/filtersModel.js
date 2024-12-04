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

const getMinMaxPrice = (callback) => {
  const query = `
  SELECT DISTINCT bike_price 
  FROM bike_store.bike 
  WHERE bike_price IN (
    (SELECT MAX(bike_price) FROM bike_store.bike),
    (SELECT MIN(bike_price) FROM bike_store.bike)
  ) ORDER BY bike_price;
  `;

  queryDatabase(query, [], callback);
};

const getMinMaxBikeWeight = (callback) => {
  const query = `
  SELECT DISTINCT bike_weight
  FROM bike_store.bike
  WHERE bike_weight IN (
    (SELECT MAX(bike_weight) FROM bike_store.bike),
    (SELECT MIN(bike_weight) FROM bike_store.bike)
  )
  ORDER BY bike_weight;
  `;

  queryDatabase(query, [], callback);
};

module.exports = {
  getDistinctGenders,
  getDistinctWheelSizes,
  getDistinctColors,
  getMinMaxPrice,
  getMinMaxBikeWeight,
};
