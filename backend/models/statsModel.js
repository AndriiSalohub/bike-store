const { queryDatabase } = require("../db/db");

const getAllTypesStatistic = (startDate, endDate, callback) => {
  const query = `
    SELECT 
      t.type_name, 
      SUM(bco.quantity) AS sold_count, 
      SUM(b.bike_price * bco.quantity) AS total_revenue, 
      AVG(b.bike_price) AS avg_price 
    FROM 
      bike_store.bike b
    INNER JOIN 
      bike_store.bike_cart bc ON b.bike_id = bc.bike_id
    INNER JOIN 
      bike_store.bike_cart_order bco ON bc.bike_cart_id = bco.bike_cart_id
    INNER JOIN 
      bike_store.type t ON b.type_id = t.type_id 
    INNER JOIN 
      bike_store.order o ON bco.order_id = o.order_id
    WHERE 
      o.order_status = 'Завершено' 
      AND (o.order_date BETWEEN ? AND ? OR ? IS NULL)
    GROUP BY 
      t.type_name;
  `;

  queryDatabase(query, [startDate, endDate, startDate], callback);
};

const getAllBrandsStatistic = (startDate, endDate, callback) => {
  const query = `
    SELECT 
      br.brand_name, 
      COUNT(b.bike_id) AS total_bikes,
      SUM(bco.quantity) AS sold_count, 
      ROUND(AVG(b.bike_rating), 2) AS avg_rating
    FROM 
      bike_store.brand br
    LEFT JOIN 
      bike_store.bike b ON br.brand_id = b.brand_id
    LEFT JOIN 
      bike_store.bike_cart bc ON b.bike_id = bc.bike_id
    LEFT JOIN 
      bike_store.bike_cart_order bco ON bc.bike_cart_id = bco.bike_cart_id
    LEFT JOIN 
      bike_store.order o ON bco.order_id = o.order_id 
    WHERE 
      o.order_status = 'Завершено'
      AND (o.order_date BETWEEN ? AND ? OR ? IS NULL)
    GROUP BY 
      br.brand_name;
  `;

  queryDatabase(query, [startDate, endDate, startDate], callback);
};

const getOrdersStatistic = (startDate, endDate, callback) => {
  const query = `
    SELECT
        o.payment_method,
        ROUND(AVG(order_items.total_items), 2) AS avg_items_per_order,
        ROUND(AVG(order_items.total_price), 2) AS avg_price_per_order
    FROM
        bike_store.order o
    JOIN
        (
            SELECT
                o.order_id,
                SUM(bco.quantity) AS total_items,
                SUM(bco.quantity * b.bike_price) AS total_price
            FROM
                bike_store.order o
            INNER JOIN
                bike_store.bike_cart_order bco ON o.order_id = bco.order_id
            INNER JOIN
                bike_store.bike_cart bc ON bco.bike_cart_id = bc.bike_cart_id
            INNER JOIN
                bike_store.bike b ON bc.bike_id = b.bike_id
            WHERE
                o.order_status = 'Завершено'
                AND (? IS NULL OR o.order_date BETWEEN ? AND ?)
            GROUP BY
                o.order_id
        ) AS order_items ON o.order_id = order_items.order_id
    GROUP BY
        o.payment_method;
  `;

  queryDatabase(query, [startDate, endDate, startDate], callback);
};

const getPopularBikesStatistic = (callback) => {
  const query = `
    SELECT 
      b.bike_model,
      b.bike_image_url,
      SUM(bco.quantity) AS total_sold,
      b.bike_price AS price,
      b.bike_rating
    FROM 
      bike_store.bike_cart_order bco
    INNER JOIN 
      bike_store.bike_cart bc ON bco.bike_cart_id = bc.bike_cart_id
    INNER JOIN 
      bike_store.bike b ON bc.bike_id = b.bike_id
    INNER JOIN
      bike_store.order o ON bco.order_id = o.order_id
    WHERE 
      o.order_status = 'Завершено'
    GROUP BY 
      b.bike_id
    ORDER BY 
      total_sold DESC
    LIMIT 10;
  `;

  queryDatabase(query, [], callback);
};

module.exports = {
  getAllTypesStatistic,
  getAllBrandsStatistic,
  getOrdersStatistic,
  getPopularBikesStatistic,
};
