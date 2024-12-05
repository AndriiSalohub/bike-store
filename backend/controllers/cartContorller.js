const {
  createInitialCart,
  addToCart,
  getCurrentCart,
  isItemInCart,
  getCartItemsCount,
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

module.exports = {
  createCartOnRegister,
  postToCart,
  checkCartStatus,
  getCart,
  getCartItemsAmount,
};
