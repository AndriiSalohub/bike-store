const { queryDatabase } = require("../db/db");

const getAllPromotions = (callback) => {
  const query = "SELECT * FROM bike_store.promotion";
  queryDatabase(query, [], callback);
};

const getAllCurrentPromotions = (callback) => {
  const query =
    "SELECT * FROM bike_store.promotion WHERE promotion_end_date > NOW()";
  queryDatabase(query, [], callback);
};

const createPromotion = (promotionData, callback) => {
  const {
    promotion_name,
    promotion_start_date,
    promotion_end_date,
    discount_percentage,
  } = promotionData;

  const query = `
    INSERT INTO bike_store.promotion 
    (promotion_name, promotion_start_date, promotion_end_date, discount_percentage) 
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    promotion_name,
    promotion_start_date,
    promotion_end_date,
    discount_percentage,
  ];

  queryDatabase(query, values, callback);
};

const updatePromotion = (promotionId, promotionData, callback) => {
  const {
    promotion_name,
    promotion_start_date,
    promotion_end_date,
    discount_percentage,
  } = promotionData;

  const query = `
    UPDATE bike_store.promotion 
    SET promotion_name = ?, 
        promotion_start_date = ?, 
        promotion_end_date = ?, 
        discount_percentage = ? 
    WHERE promotion_id = ?
  `;

  const values = [
    promotion_name,
    promotion_start_date,
    promotion_end_date,
    discount_percentage,
    promotionId,
  ];

  queryDatabase(query, values, callback);
};

const deletePromotion = (promotionId, callback) => {
  const query = "DELETE FROM bike_store.promotion WHERE promotion_id = ?";
  queryDatabase(query, [promotionId], callback);
};

module.exports = {
  getAllPromotions,
  getAllCurrentPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
