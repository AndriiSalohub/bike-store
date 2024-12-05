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
    SELECT * FROM bike_store.cart 
    WHERE cart_id = ? AND cart_status = 'Відмінено'
  `;

  queryDatabase(checkQuery, [cartId], (statusCheckErr, statusResult) => {
    if (statusCheckErr) return callback(statusCheckErr);

    if (statusResult.length > 0) {
      const updateStatusQuery = `
        UPDATE bike_store.cart 
        SET cart_status = 'Очікується', cart_updated_at = NOW() 
        WHERE cart_id = ?
      `;
      queryDatabase(updateStatusQuery, [cartId], (updateErr) => {
        if (updateErr) return callback(updateErr);
        proceedWithCartAddition();
      });
    } else {
      proceedWithCartAddition();
    }

    function proceedWithCartAddition() {
      const checkExistingQuery = `
        SELECT * FROM bike_store.bike_cart 
        WHERE bike_id = ? AND cart_id = ?
      `;

      queryDatabase(
        checkExistingQuery,
        [bikeId, cartId],
        (checkErr, existingItems) => {
          if (checkErr) return callback(checkErr);

          if (existingItems.length > 0) {
            const removeQuery = `
            DELETE FROM bike_store.bike_cart 
            WHERE bike_id = ? AND cart_id = ?
          `;
            queryDatabase(removeQuery, [bikeId, cartId], (removeErr) => {
              if (removeErr) return callback(removeErr);

              const updateCartTimestampQuery = `
              UPDATE bike_store.cart 
              SET cart_updated_at = NOW() 
              WHERE cart_id = ?
            `;
              queryDatabase(updateCartTimestampQuery, [cartId], callback);
            });
          } else {
            const insertQuery = `
            INSERT INTO bike_store.bike_cart 
            (bike_id, cart_id, quantity) 
            VALUES (?, ?, ?)
          `;
            queryDatabase(
              insertQuery,
              [bikeId, cartId, quantity],
              (insertErr) => {
                if (insertErr) return callback(insertErr);

                const updateCartTimestampQuery = `
              UPDATE bike_store.cart 
              SET cart_updated_at = NOW() 
              WHERE cart_id = ?
            `;
                queryDatabase(updateCartTimestampQuery, [cartId], callback);
              },
            );
          }
        },
      );
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
    WHERE user_email = ? 
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

const getItemsFromTheCart = (cartId, callback) => {
  const query = `
    SELECT * FROM bike_store.bike b 
    INNER JOIN bike_store.bike_cart bc ON bc.bike_id = b.bike_id 
    INNER JOIN bike_store.cart c ON bc.cart_id = c.cart_id 
    WHERE c.cart_status = "Очікується" AND c.cart_id = ?;  
  `;

  queryDatabase(query, [cartId], callback);
};

const updateCartItemQuantity = (bikeId, cartId, quantity, callback) => {
  const query = `
    UPDATE bike_store.bike_cart 
    SET quantity = ? 
    WHERE bike_id = ? AND cart_id = ?
  `;

  queryDatabase(query, [quantity, bikeId, cartId], (updateErr) => {
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
    DELETE FROM bike_store.bike_cart 
    WHERE bike_id = ? AND cart_id = ?
  `;

  queryDatabase(query, [bikeId, cartId], (removeErr) => {
    if (removeErr) callback(removeErr);

    const updateCartTimestampQuery = `
      UPDATE bike_store.cart 
      SET cart_updated_at = NOW() 
      WHERE cart_id = ?
    `;

    queryDatabase(updateCartTimestampQuery, [cartId], callback);
  });
};

const calculateCartTotal = (cartId, callback) => {
  const query = `
    SELECT SUM(b.bike_price * bc.quantity) as total_cart_price
    FROM bike_store.bike_cart bc
    JOIN bike_store.bike b ON bc.bike_id = b.bike_id
    JOIN bike_store.cart c ON bc.cart_id = c.cart_id
    WHERE c.cart_id = ? AND c.cart_status = 'Очікується'
  `;

  queryDatabase(query, [cartId], callback);
};

const calculateCartQuantity = (cartId, callback) => {
  const query = `
    SELECT SUM(bc.quantity) as total_quantity
    FROM bike_store.bike_cart bc 
    INNER JOIN bike_store.cart c ON bc.cart_id = c.cart_id 
    WHERE c.cart_id = ?;
  `;

  queryDatabase(query, [cartId], callback);
};

const clearCartItems = (cartId, callback) => {
  const deleteItemsQuery = `
    DELETE FROM bike_store.bike_cart 
    WHERE cart_id = ?
  `;

  queryDatabase(deleteItemsQuery, [cartId], (deleteErr) => {
    if (deleteErr) return callback(deleteErr);

    const updateCartStatusQuery = `
      UPDATE bike_store.cart 
      SET cart_status = 'Відмінено', cart_updated_at = NOW() 
      WHERE cart_id = ?
    `;

    queryDatabase(updateCartStatusQuery, [cartId], callback);
  });
};

module.exports = {
  createInitialCart,
  addToCart,
  isItemInCart,
  getCurrentCart,
  getCartItemsCount,
  getItemsFromTheCart,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartTotal,
  calculateCartQuantity,
  clearCartItems,
};
