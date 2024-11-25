const { queryDatabase } = require("../db/db");

const getAllTypesStatistic = (callback) => {
  const query = `
  SELECT 
     t.type_name, 
     COUNT(bs.bike_id) AS total_bike_count
  FROM bike_store.type t
  INNER JOIN bike_store.bike b ON t.type_id = b.type_id
  INNER JOIN bike_store.bike_cart bs ON b.bike_id = bs.bike_id
  INNER JOIN bike_store.cart c ON c.cart_id = bs.cart_id 
  WHERE c.cart_status = "Завершено"
  GROUP BY t.type_name;
  `;

  queryDatabase(query, [], callback);
};

const getAllBrandsStatistic = (callback) => {
  const query = `
  SELECT 
    br.brand_name, 
    COUNT(b.bike_id) AS total_bike_count,
    SUM(CASE WHEN c.cart_status = "Завершено" THEN 1 ELSE 0 END) AS sold_bike_count,
    AVG(b.bike_rating) AS average_rating
  FROM bike_store.brand br
  LEFT JOIN bike_store.bike b ON br.brand_id = b.brand_id
  LEFT JOIN bike_store.bike_cart bs ON b.bike_id = bs.bike_id
  LEFT JOIN bike_store.cart c ON c.cart_id = bs.cart_id
  GROUP BY br.brand_name;
  `;

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllTypesStatistic,
  getAllBrandsStatistic,
};
