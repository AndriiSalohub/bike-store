const { queryDatabase } = require("../db/db");

const getAllBikes = (callback) => {
  const query = "SELECT * FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

const getBikeById = (bikeId, callback) => {
  const query = "SELECT * FROM bike_store.bike WHERE bike_id = ?";

  queryDatabase(query, [bikeId], callback);
};

const updateBike = (bikeId, newBike, callback) => {
  const query = "UPDATE bike_store.bike SET ? WHERE bike_id = ?";

  queryDatabase(query, [newBike, bikeId], callback);
};

const deleteBike = (bikeId, callback) => {
  const query = "DELETE FROM bike_store.bike WHERE bike_id = ?";

  queryDatabase(query, [bikeId], callback);
};

const getTopBikes = (callback) => {
  const query =
    "SELECT * FROM bike_store.bike ORDER BY bike.bike_rating DESC LIMIT 7;";

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getTopBikes,
};
