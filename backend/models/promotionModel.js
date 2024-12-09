const { queryDatabase } = require("../db/db");

const getAllPromotions = (callback) => {
  const query = "SELECT * FROM bike_store.promotion";

  queryDatabase(query, [], callback);
};

const getAllCurrentPromoitons = (callback) => {
  const query =
    "SELECT * FROM bike_store.promotion WHERE promotion_end_date > NOW()";

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllPromotions,
  getAllCurrentPromoitons,
};
