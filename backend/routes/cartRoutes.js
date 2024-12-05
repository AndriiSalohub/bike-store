const express = require("express");
const {
  postToCart,
  getCart,
  checkCartStatus,
  getCartItemsAmount,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getCartDetails,
  clearCart,
} = require("../controllers/cartContorller");

const router = express.Router();

router.post("/bike_cart", postToCart);
router.get("/cart", getCart);
router.get("/cart/status", checkCartStatus);
router.get("/cart_count", getCartItemsAmount);
router.get("/cart-items", getCartItems);
router.post("/update-cart-item", updateCartItem);
router.delete("/cart-item/:bikeId", deleteCartItem);
router.get("/cart/details", getCartDetails);
router.post("/clear-cart", clearCart);

module.exports = router;
