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

const addBike = (newBike, callback) => {
  const query = `
    INSERT INTO bike_store.bike (
      bike_model, brand_id, type_id, bike_price, wheel_size, frame_material, 
      gear_count, bike_color, bike_availability, bike_quantity, bike_rating, 
      bike_description, bike_image_url, bike_weight, gender, max_weight_capacity, 
      bike_warranty_period, bike_release_date, promotion_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newBike.bike_model,
    newBike.brand_id,
    newBike.type_id,
    newBike.bike_price,
    newBike.wheel_size,
    newBike.frame_material,
    newBike.gear_count,
    newBike.bike_color,
    newBike.bike_availability,
    newBike.bike_quantity,
    newBike.bike_rating,
    newBike.bike_description,
    newBike.bike_image_url,
    newBike.bike_weight,
    newBike.gender,
    newBike.max_weight_capacity,
    newBike.bike_warranty_period,
    newBike.bike_release_date,
    newBike.promotion_id !== null ? newBike.promotion_id : null,
  ];

  queryDatabase(query, values, callback);
};

module.exports = {
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getTopBikes,
  addBike,
};
