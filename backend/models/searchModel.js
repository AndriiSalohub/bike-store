const { queryDatabase } = require("../db/db");

const getSearchResults = (search, callback) => {
  let query = `
    SELECT 
      bike.bike_id,
      bike.bike_model,
      bike.bike_color,
      bike.bike_image_url,
      type.type_name,
      brand.brand_name
    FROM bike_store.bike 
    JOIN bike_store.type ON bike.type_id = type.type_id
    JOIN bike_store.brand ON bike.brand_id = brand.brand_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (
      bike.bike_model LIKE ? OR 
      bike.bike_color LIKE ? OR 
      type.type_name LIKE ? OR
      brand.brand_name LIKE ?
    )`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  queryDatabase(query, params, callback);
};

module.exports = {
  getSearchResults,
};
