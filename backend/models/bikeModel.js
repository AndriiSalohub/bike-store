const { queryDatabase } = require("../db/db");

const getAllBikes = (filters, sorting, callback) => {
  let query = `
    SELECT * FROM bike_store.bike 
    WHERE 1=1
  `;
  const queryParams = [];

  if (filters) {
    if (filters.types && filters.types.length > 0) {
      query += ` AND type_id IN (SELECT type_id FROM bike_store.type WHERE type_name IN (?))`;
      queryParams.push(filters.types);
    }

    if (filters.brands && filters.brands.length > 0) {
      query += ` AND brand_id IN (SELECT brand_id FROM bike_store.brand WHERE brand_name IN (?))`;
      queryParams.push(filters.brands);
    }

    if (filters.genders && filters.genders.length > 0) {
      query += ` AND gender IN (?)`;
      queryParams.push(filters.genders);
    }

    if (filters.wheelSizes && filters.wheelSizes.length > 0) {
      query += ` AND wheel_size IN (?)`;
      queryParams.push(filters.wheelSizes);
    }

    if (filters.colors && filters.colors.length > 0) {
      query += ` AND bike_color IN (?)`;
      queryParams.push(filters.colors);
    }

    if (filters.price) {
      query += ` AND bike_price BETWEEN ? AND ?`;
      queryParams.push(filters.price[0], filters.price[1]);
    }

    if (filters.rating) {
      query += ` AND bike_rating BETWEEN ? AND ?`;
      queryParams.push(filters.rating[0], filters.rating[1]);
    }

    if (filters.weight) {
      query += ` AND bike_weight BETWEEN ? AND ?`;
      queryParams.push(filters.weight[0], filters.weight[1]);
    }
  }

  if (sorting) {
    switch (sorting) {
      case "price_desc":
        query += " ORDER BY bike_price DESC";
        break;
      case "price_asc":
        query += " ORDER BY bike_price ASC";
        break;
      case "rating":
        query += " ORDER BY bike_rating DESC";
        break;
      case "default":
      default:
        break;
    }
  }

  queryDatabase(query, queryParams, callback);
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

const getDistinctGenders = (callback) => {
  const query = "SELECT DISTINCT gender FROM bike_store.bike";

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getTopBikes,
  addBike,
  getDistinctGenders,
};
