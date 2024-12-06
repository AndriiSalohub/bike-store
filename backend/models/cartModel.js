const { queryDatabase } = require("../db/db");

const createInitialCart = (userEmail, userRole, callback) => {
  const query =
    "INSERT INTO bike_store.cart (user_email, cart_status) VALUES (?, 'Очікується')";

  queryDatabase(query, [userEmail], callback);
};

const addToCart = (bikeId, cartId, quantity, callback) => {
  const checkQuery = `
    SELECT bike_cart_id, quantity 
    FROM bike_store.bike_cart 
    WHERE cart_id = ? AND bike_id = ? AND bike_cart_status = 'Активний';
  `;

  queryDatabase(checkQuery, [cartId, bikeId], (checkErr, existingItems) => {
    if (checkErr) return callback(checkErr);

    if (existingItems.length > 0) {
      const activeRecord = existingItems[0];
      const updateQuery = `
        UPDATE bike_store.bike_cart 
        SET quantity = quantity + ? 
        WHERE bike_cart_id = ?;
      `;
      queryDatabase(
        updateQuery,
        [quantity, activeRecord.bike_cart_id],
        callback,
      );
    } else {
      const insertQuery = `
        INSERT INTO bike_store.bike_cart 
        (cart_id, bike_id, quantity, bike_cart_status) 
        VALUES (?, ?, ?, 'Активний');
      `;
      queryDatabase(insertQuery, [cartId, bikeId, quantity], callback);
    }
  });
};

const isItemInCart = (bikeId, cartId, callback) => {
  const query = `
    SELECT COUNT(*) as count 
    FROM bike_store.bike_cart 
    WHERE cart_id = ? AND bike_id = ? AND bike_cart_status = 'Активний'
  `;
  queryDatabase(query, [cartId, bikeId], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result[0].count > 0);
  });
};

const getCurrentCart = (email, callback) => {
  const query = `
    SELECT c.cart_id, c.cart_status 
    FROM bike_store.cart c 
    WHERE c.user_email = ? 
    ORDER BY c.cart_created_at DESC 
    LIMIT 1
  `;

  queryDatabase(query, [email], callback);
};

const getCartItemsCount = (cartId, callback) => {
  const query = `
    SELECT SUM(quantity) as total_quantity 
    FROM bike_store.bike_cart 
    WHERE cart_id = ? AND bike_cart_status = 'Активний'
  `;
  queryDatabase(query, [cartId], callback);
};

const getItemsFromTheCart = (cartId, callback) => {
  const query = `
    SELECT 
      bc.bike_cart_id,
      bc.bike_id, 
      b.bike_model, 
      b.bike_price, 
      bc.quantity, 
      b.bike_image_url,
      b.frame_material,
      b.bike_color
    FROM bike_store.bike_cart bc
    JOIN bike_store.bike b ON bc.bike_id = b.bike_id
    WHERE bc.cart_id = ? AND bc.bike_cart_status = 'Активний'
  `;
  queryDatabase(query, [cartId], callback);
};

const updateCartItemQuantity = (
  bikeId,
  cartId,
  quantity,
  bikeCartId,
  callback,
) => {
  const query = `
    UPDATE bike_store.bike_cart 
    SET quantity = ? 
    WHERE bike_id = ? AND cart_id = ? AND bike_cart_id = ?
  `;

  queryDatabase(query, [quantity, bikeId, cartId, bikeCartId], (updateErr) => {
    if (updateErr) return callback(updateErr);

    const updateCartTimestampQuery = `
      UPDATE bike_store.cart 
      SET cart_updated_at = NOW() 
      WHERE cart_id = ?
    `;

    queryDatabase(updateCartTimestampQuery, [cartId], callback);
  });
};

const removeCartItem = (bikeId, cartId, callback) => {
  const query = `
    UPDATE bike_store.bike_cart 
    SET quantity = 0, 
        bike_cart_status = 'Архівований' 
    WHERE cart_id = ? AND bike_id = ?
  `;
  queryDatabase(query, [cartId, bikeId], callback);
};

const calculateCartQuantity = (cartId, callback) => {
  const query = `
    SELECT SUM(quantity) as total_quantity 
    FROM bike_store.bike_cart 
    WHERE cart_id = ? AND bike_cart_status = 'Активний'
  `;
  queryDatabase(query, [cartId], callback);
};

const calculateCartTotal = (cartId, callback) => {
  const query = `
    SELECT SUM(bc.quantity * b.bike_price) as total_cart_price 
    FROM bike_store.bike_cart bc
    JOIN bike_store.bike b ON bc.bike_id = b.bike_id
    WHERE bc.cart_id = ? AND bc.bike_cart_status = 'Активний'
  `;
  queryDatabase(query, [cartId], callback);
};

const clearCartItems = (cartId, callback) => {
  const query = `
    UPDATE bike_store.bike_cart 
    SET quantity = 0, 
        bike_cart_status = 'Архівований' 
    WHERE cart_id = ?
  `;
  queryDatabase(query, [cartId], callback);
};

module.exports = {
  createInitialCart,
  addToCart,
  getCurrentCart,
  isItemInCart,
  getCartItemsCount,
  getItemsFromTheCart,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartQuantity,
  calculateCartTotal,
  clearCartItems,
};
