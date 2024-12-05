const {
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
} = require("../models/cartModel");

const createCartOnRegister = (userEmail, userRole, callback) => {
  createInitialCart(userEmail, userRole, callback);
};

const postToCart = (req, res) => {
  const { bikeId, cartId, quantity = 1 } = req.body;

  if (!bikeId || !cartId) {
    return res.status(400).json({
      error: "BikeId and CartId are required",
    });
  }

  addToCart(bikeId, cartId, quantity, (err, data) => {
    if (err) {
      console.error("Error adding/removing from cart:", err);
      return res.status(500).json({
        error: "Failed to modify cart",
        details: err.message,
      });
    }

    isItemInCart(bikeId, cartId, (checkErr, isInCart) => {
      if (checkErr) {
        return res.status(500).json({
          error: "Error checking cart status",
          details: checkErr.message,
        });
      }

      return res.status(200).json({
        message: isInCart ? "Bike added to cart" : "Bike removed from cart",
        isInCart,
      });
    });
  });
};

const checkCartStatus = (req, res) => {
  const { bikeId, cartId } = req.query;

  if (!bikeId || !cartId) {
    return res.status(400).json({
      error: "BikeId and CartId are required",
    });
  }

  isItemInCart(bikeId, cartId, (err, isInCart) => {
    if (err) {
      return res.status(500).json({
        error: "Error checking cart status",
        details: err.message,
      });
    }

    return res.status(200).json({ isInCart });
  });
};

const getCart = (req, res) => {
  const email = req.query.email;

  getCurrentCart(email, (err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні кошику.");
    }

    return res.send(data);
  });
};

const getCartItemsAmount = (req, res) => {
  const cartId = req.query.cartId;

  getCartItemsCount(cartId, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні кільлькості елементів в кошику.");
    }

    return res.send(data);
  });
};

const getCartItems = (req, res) => {
  const cartId = req.query.cartId;

  getItemsFromTheCart(cartId, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні велосипедів в кошику.");
    }

    return res.send(data);
  });
};

const updateCartItem = (req, res) => {
  const { bikeId, quantity, email } = req.body;

  getCurrentCart(email, (cartErr, cartData) => {
    if (cartErr || !cartData || cartData.length === 0) {
      return res.status(500).json({
        error: "Не вдалося знайти поточний кошик.",
        details: cartErr?.message,
      });
    }

    const cartId = cartData[0].cart_id;

    updateCartItemQuantity(bikeId, cartId, quantity, (err) => {
      if (err) {
        console.error("Error updating cart item:", err);
        return res.status(500).json({
          error: "Не вдалося оновити кількість товару.",
          details: err.message,
        });
      }
      return res.status(200).json({ message: "Кількість товару оновлена" });
    });
  });
};

const deleteCartItem = (req, res) => {
  const { bikeId, email } = req.query;

  getCurrentCart(email, (cartErr, cartData) => {
    if (cartErr || !cartData || cartData.length === 0) {
      return res.status(500).json({
        error: "Не вдалося знайти поточний кошик.",
        details: cartErr?.message,
      });
    }

    const cartId = cartData[0].cart_id;

    removeCartItem(bikeId, cartId, (err) => {
      if (err) {
        console.error("Error removing cart item:", err);
        return res.status(500).json({
          error: "Не вдалося видалити товар з кошику.",
          details: err.message,
        });
      }
      return res.status(200).json({ message: "Товар видалено з кошику" });
    });
  });
};

const getCartDetails = (req, res) => {
  const { cartId } = req.query;

  if (!cartId) {
    return res.status(400).json({
      error: "CartId is required",
    });
  }

  calculateCartQuantity(cartId, (err, cartQuantity) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при інформації про кількість товарів в кошику.");
    }

    calculateCartTotal(cartId, (totalErr, totalResult) => {
      if (totalErr) {
        console.error("Error calculating cart total:", totalErr);
        return res.status(500).json({
          error: "Failed to calculate cart total",
          details: totalErr.message,
        });
      }

      return res.status(200).json({
        quantity: cartQuantity[0]?.total_quantity || 0,
        total: totalResult[0]?.total_cart_price || 0,
      });
    });
  });
};

const clearCart = (req, res) => {
  const { email } = req.body;

  getCurrentCart(email, (cartErr, cartData) => {
    if (cartErr || !cartData || cartData.length === 0) {
      return res.status(500).json({
        error: "Не вдалося знайти поточний кошик.",
        details: cartErr?.message,
      });
    }

    const cartId = cartData[0].cart_id;

    clearCartItems(cartId, (err) => {
      if (err) {
        console.error("Помилка очищення кошику:", err);
        return res.status(500).json({
          error: "Не вдалося очистити кошик.",
          details: err.message,
        });
      }
      return res.status(200).json({ message: "Кошик очищений" });
    });
  });
};

module.exports = {
  createCartOnRegister,
  postToCart,
  checkCartStatus,
  getCart,
  getCartItemsAmount,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getCartDetails,
  clearCart,
};
