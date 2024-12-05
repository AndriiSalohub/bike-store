const express = require("express");
const {
  processOrder,
  downloadReceipt,
  fetchOrderHistory,
  cancelOrderById,
} = require("../controllers/orderContoller");
const router = express.Router();

router.post("/create-order", processOrder);
router.get("/download-receipt/:filename", downloadReceipt);
router.get("/order-history", fetchOrderHistory);
router.put("/cancel-order/:orderId", cancelOrderById);

module.exports = router;
