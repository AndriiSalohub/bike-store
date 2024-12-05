const {
  createOrder,
  getOrderHistory,
  cancelOrder,
} = require("../models/orderModel");
const path = require("path");

const processOrder = (req, res) => {
  const { email, paymentMethod, deliveryPrice, selectedCartItems } = req.body;
  if (
    !email ||
    !paymentMethod ||
    !selectedCartItems ||
    selectedCartItems.length === 0
  ) {
    return res.status(400).json({
      error: "Missing required order details",
    });
  }
  createOrder(
    { email, paymentMethod, deliveryPrice },
    selectedCartItems,
    (err, result) => {
      if (err) {
        console.error("Order creation error:", err);
        return res.status(500).json({
          error: "Failed to create order",
          details: err.message,
        });
      }
      return res.status(200).json({
        message: "Order created successfully",
        orderId: result.orderId,
        receiptFilename: result.receiptFilename || null,
      });
    },
  );
};

const downloadReceipt = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../receipts", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).json({ error: "Receipt not found" });
    }
  });
};

const fetchOrderHistory = (req, res) => {
  const {
    email,
    sortBy = "date",
    sortOrder = "desc",
    paymentFilter = "all",
    statusFilter = "all",
  } = req.query;

  getOrderHistory(
    email,
    sortBy,
    sortOrder,
    paymentFilter,
    statusFilter,
    (err, history) => {
      if (err) {
        console.error("Помилка отримання історії замовлень:", err);
        return res.status(500).json({ error: "Failed to fetch order history" });
      }
      res.status(200).json({ history });
    },
  );
};

const cancelOrderById = (req, res) => {
  const { orderId } = req.params;

  cancelOrder(orderId, (err, result) => {
    if (err) {
      console.error("Помилка відміни замовлення:", err);
      return res.status(500).json({ error: "Failed to cancel order" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    res.status(200).json({ message: "Order canceled successfully" });
  });
};

module.exports = {
  processOrder,
  downloadReceipt,
  fetchOrderHistory,
  cancelOrderById,
};
