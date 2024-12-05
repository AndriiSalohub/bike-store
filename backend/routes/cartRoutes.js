const express = require("express");
const {
  postToCart,
  getCart,
  checkCartStatus,
  getCartItemsAmount,
} = require("../controllers/cartContorller");

const router = express.Router();

router.post("/bike_cart", postToCart);
router.get("/cart", getCart);
router.get("/cart/status", checkCartStatus);
router.get("/cart_count", getCartItemsAmount);

module.exports = router;
