const { queryDatabase } = require("../db/db");

const createInitialCart = (userEmail, userRole, callback) => {
  if (userRole === "Адмін") {
    return callback(null, null);
  }

  const query = `
    INSERT INTO bike_store.cart 
    (user_email, cart_status) 
    VALUES (?, 'Очікується')
  `;

  queryDatabase(query, [userEmail], callback);
};

const addToCart = (bikeId, cartId, quantity, callback) => {
  const checkQuery = `
    SELECT * FROM bike_store.bike_cart 
    WHERE bike_id = ? AND cart_id = ?
  `;

  queryDatabase(checkQuery, [bikeId, cartId], (checkErr, existingItems) => {
    if (checkErr) return callback(checkErr);

    if (existingItems.length > 0) {
      const removeQuery = `
        DELETE FROM bike_store.bike_cart 
        WHERE bike_id = ? AND cart_id = ?
      `;

      queryDatabase(removeQuery, [bikeId, cartId], callback);
    } else {
      const insertQuery = `
        INSERT INTO bike_store.bike_cart 
        (bike_id, cart_id, quantity) 
        VALUES (?, ?, ?)
      `;

      queryDatabase(insertQuery, [bikeId, cartId, quantity], callback);
    }
  });
};

const isItemInCart = (bikeId, cartId, callback) => {
  const query = `
    SELECT * FROM bike_store.bike_cart 
    WHERE bike_id = ? AND cart_id = ?
  `;

  queryDatabase(query, [bikeId, cartId], (err, results) => {
    if (err) return callback(err, false);
    callback(null, results.length > 0);
  });
};

const getCurrentCart = (userEmail, callback) => {
  const query = `
    SELECT cart_id 
    FROM bike_store.cart 
    WHERE user_email = ? AND cart_status = 'Очікується' 
    ORDER BY cart_created_at DESC 
    LIMIT 1
  `;

  queryDatabase(query, [userEmail], callback);
};

const getCartItemsCount = (cartId, callback) => {
  const query = `
    SELECT COUNT(bike_cart_id) 
    FROM bike_store.bike_cart 
    WHERE cart_id = ?;
  `;

  queryDatabase(query, [cartId], callback);
};

module.exports = {
  createInitialCart,
  addToCart,
  isItemInCart,
  getCurrentCart,
  getCartItemsCount,
};
