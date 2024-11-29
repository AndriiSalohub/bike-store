const { queryDatabase } = require("../db/db");

const getAllTypesStatistic = (callback) => {
  const query = `
  SELECT 
    t.type_name, 
    COUNT(bco.bike_cart_id) AS sold_count, 
    SUM(b.bike_price * bc.quantity) AS total_revenue, 
    AVG(b.bike_price) AS avg_price 
  FROM 
    bike_store.bike b
  INNER JOIN 
    bike_store.bike_cart bc ON b.bike_id = bc.bike_id
  INNER JOIN 
    bike_store.bike_cart_order bco ON bc.bike_cart_id = bco.bike_cart_id
  INNER JOIN 
    bike_store.cart c ON bc.cart_id = c.cart_id
  INNER JOIN 
    bike_store.type t ON b.type_id = t.type_id 
  INNER JOIN 
    bike_store.order o ON bco.order_id = o.order_id
  WHERE 
    o.order_status != 'Відмінено' 
  GROUP BY 
    t.type_name;
  `;

  queryDatabase(query, [], callback);
};

const getAllBrandsStatistic = (callback) => {
  const query = `
  SELECT 
    br.brand_name, 
    COUNT(b.bike_id) AS total_bikes,
    COUNT(bco.bike_cart_id) AS sold_count, 
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
    bike_store.cart c ON bc.cart_id = c.cart_id 
  LEFT JOIN 
    bike_store.order o ON bco.order_id = o.order_id AND o.order_status != 'Відмінено' 
  GROUP BY 
    br.brand_name;
  `;

  queryDatabase(query, [], callback);
};

const getOrdersStatistic = (callback) => {
  const query = `
  SELECT
    o.payment_method,
    AVG(order_items.total_items) AS avg_items_per_order,
    AVG(order_items.total_price) AS avg_price_per_order
  FROM
    bike_store.order o
  JOIN
    (
        SELECT
            o.order_id,
            SUM(bc.quantity) AS total_items,
            SUM(bc.quantity * b.bike_price) AS total_price
        FROM
            bike_store.order o
        INNER  JOIN
            bike_store.bike_cart_order bco ON o.order_id = bco.order_id
        INNER JOIN
            bike_store.bike_cart bc ON bco.bike_cart_id = bc.bike_cart_id
        INNER JOIN
            bike_store.bike b ON bc.bike_id = b.bike_id
        GROUP BY
            o.order_id
    ) AS order_items ON o.order_id = order_items.order_id
  GROUP BY
    o.payment_method;
  `;

  queryDatabase(query, [], callback);
};

const getPopularBikesStatistic = (callback) => {
  const query = `
  SELECT 
    b.bike_model,
    b.bike_image_url,
    SUM(bc.quantity) AS total_sold,
    b.bike_price AS price,
    b.bike_rating
  FROM 
    bike_store.bike_cart AS bc
  INNER JOIN 
    bike_store.bike AS b ON bc.bike_id = b.bike_id
  INNER JOIN 
    bike_store.cart AS c ON bc.cart_id = c.cart_id
  WHERE 
    c.cart_status = 'Завершено'
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
