const { queryDatabase } = require("../db/db");

// Sales Report
const getSalesReport = (startDate, endDate, callback) => {
  const formattedStartDate = startDate
    ? new Date(startDate).toISOString().slice(0, 19).replace("T", " ")
    : null;
  const formattedEndDate = endDate
    ? new Date(endDate).toISOString().slice(0, 19).replace("T", " ")
    : null;

  const query = `
    SELECT 
      t.type_name AS type_name,
      SUM(bco.quantity) AS sold_count,
      SUM(b.bike_price * bco.quantity) AS total_revenue,
      ROUND(SUM(b.bike_price * bco.quantity) / SUM(bco.quantity), 2) AS avg_price
    FROM 
      bike_store.bike b
    INNER JOIN 
      bike_store.type t ON b.type_id = t.type_id
    INNER JOIN 
      bike_store.bike_cart bc ON b.bike_id = bc.bike_id
    INNER JOIN 
      bike_store.bike_cart_order bco ON bc.bike_cart_id = bco.bike_cart_id
    INNER JOIN 
      bike_store.order o ON bco.order_id = o.order_id
    WHERE 
      o.order_status = 'Завершено'
      AND (
        (? IS NULL OR o.order_date >= ?)
        AND (? IS NULL OR o.order_date <= ?)
      )
    GROUP BY 
      t.type_name
    ORDER BY 
      total_revenue DESC;
  `;

  // Pass formatted date values to the query
  queryDatabase(
    query,
    [
      formattedStartDate,
      formattedStartDate,
      formattedEndDate,
      formattedEndDate,
    ],
    callback,
  );
};

// Quantity Report
const getQuantityReport = (callback) => {
  const query = `
    SELECT 
      b.bike_model,
      br.brand_name,
      t.type_name,
      b.bike_price,
      b.bike_color,
      b.bike_quantity,
      b.bike_rating
    FROM 
      bike_store.bike b
    INNER JOIN 
      bike_store.brand br ON b.brand_id = br.brand_id
    INNER JOIN 
      bike_store.type t ON b.type_id = t.type_id
    WHERE 
      b.bike_quantity < 10
    ORDER BY 
      b.bike_quantity ASC;
  `;

  queryDatabase(query, [], callback);
};

module.exports = {
  getSalesReport,
  getQuantityReport,
};
