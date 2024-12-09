const { queryDatabase } = require("../db/db");

const getAllFeatures = (callback) => {
  const query =
    "SELECT * FROM bike_store.feature WHERE feature_availability = TRUE";
  queryDatabase(query, [], callback);
};

const getFeatureById = (featureId, callback) => {
  const query = "SELECT * FROM bike_store.feature WHERE feature_id = ?";
  queryDatabase(query, [featureId], callback);
};

const createFeature = (featureData, callback) => {
  const {
    feature_name,
    feature_price,
    feature_description,
    feature_availability,
    feature_quantity,
    feature_warranty_period,
    feature_image_url,
  } = featureData;

  const query = `
    INSERT INTO bike_store.feature 
    (feature_name, feature_price, feature_description, feature_availability, 
     feature_quantity, feature_warranty_period, feature_image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    feature_name,
    feature_price,
    feature_description,
    feature_availability,
    feature_quantity,
    feature_warranty_period,
    feature_image_url,
  ];

  queryDatabase(query, values, callback);
};

const updateFeature = (featureId, featureData, callback) => {
  const {
    feature_name,
    feature_price,
    feature_description,
    feature_availability,
    feature_quantity,
    feature_warranty_period,
    feature_image_url,
  } = featureData;

  const query = `
    UPDATE bike_store.feature 
    SET feature_name = ?, feature_price = ?, feature_description = ?, 
        feature_availability = ?, feature_quantity = ?, 
        feature_warranty_period = ?, feature_image_url = ? 
    WHERE feature_id = ?
  `;

  const values = [
    feature_name,
    feature_price,
    feature_description,
    feature_availability,
    feature_quantity,
    feature_warranty_period,
    feature_image_url,
    featureId,
  ];

  queryDatabase(query, values, callback);
};

const deleteFeature = (featureId, callback) => {
  const query = "DELETE FROM bike_store.feature WHERE feature_id = ?";
  queryDatabase(query, [featureId], callback);
};

const getFeaturesByBikeId = (bikeId, callback) => {
  const query = `
    SELECT f.* 
    FROM bike_store.feature f
    JOIN bike_store.feature_bike bf ON f.feature_id = bf.feature_id
    WHERE bf.bike_id = ? AND f.feature_availability = TRUE
  `;
  queryDatabase(query, [bikeId], callback);
};

module.exports = {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getFeaturesByBikeId,
};
