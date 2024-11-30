const { queryDatabase } = require("../db/db");

const getAllBrands = (callback) => {
  const query = "SELECT * FROM bike_store.brand";

  queryDatabase(query, [], callback);
};

const getBrandById = (brandId, callback) => {
  const query = "SELECT * FROM bike_store.brand WHERE brand_id = ?";

  queryDatabase(query, [brandId], callback);
};

const updateBrand = (brandId, newBrand, callback) => {
  const query = "UPDATE bike_store.brand SET ? WHERE brand_id = ?";

  queryDatabase(query, [newBrand, brandId], callback);
};

const deleteBrand = (brandId, callback) => {
  const query = "DELETE FROM bike_store.brand WHERE brand_id = ?";

  queryDatabase(query, [brandId], callback);
};

module.exports = {
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
