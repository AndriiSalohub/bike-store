const { queryDatabase } = require("../db/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDFReceipt = (orderDetails, selectedCartItems, callback) => {
  const receiptFilename = `receipt_${orderDetails.orderId}_${Date.now()}.pdf`;
  const receiptPath = path.join(__dirname, "../receipts", receiptFilename);

  if (!fs.existsSync(path.join(__dirname, "../receipts"))) {
    fs.mkdirSync(path.join(__dirname, "../receipts"));
  }

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(receiptPath);
  doc.pipe(stream);

  const fontPath = path.join(
    __dirname,
    "../../frontend/src/assets/fonts/Roboto/Roboto-Regular.ttf",
  );
  const boldFontPath = path.join(
    __dirname,
    "../../frontend/src/assets/fonts/Roboto/Roboto-Bold.ttf",
  );
  doc.registerFont("Roboto-Regular", fontPath);
  doc.registerFont("Roboto-Bold", boldFontPath);

  // Title
  doc
    .font("Roboto-Bold")
    .fontSize(24)
    .text("Чек замовлення", { align: "center" });
  doc.moveDown();

  doc.font("Roboto-Regular").fontSize(12);
  doc.text(`Номер замовлення: ${orderDetails.orderId}`);
  doc.text(`Дата замовлення: ${new Date().toLocaleString("uk-UA")}`);
  doc.text(`Метод оплати: ${orderDetails.paymentMethod}`);
  doc.moveDown();

  doc.font("Roboto-Bold").fontSize(12);
  const tableHeaders = ["Найменування", "Кількість", "Ціна (знижка)", "Всього"];
  const columnWidths = [200, 80, 100, 100];
  const startY = doc.y;
  let startX = 50;

  tableHeaders.forEach((header, index) => {
    doc.text(header, startX, startY, {
      width: columnWidths[index],
      align: index === 0 ? "left" : "center",
    });
    startX += columnWidths[index];
  });

  doc
    .moveTo(50, startY + 15)
    .lineTo(550, startY + 15)
    .stroke();
  doc.moveDown(1);

  const getItemDetailsQuery = `
    SELECT 
      b.bike_id, 
      b.bike_model, 
      b.bike_price, 
      COALESCE(p.discount_percentage, 0) AS discount_percentage
    FROM bike_store.bike b
    LEFT JOIN bike_store.promotion p 
      ON b.promotion_id = p.promotion_id AND p.promotion_end_date > NOW()
    WHERE b.bike_id IN (?)
  `;

  queryDatabase(
    getItemDetailsQuery,
    [selectedCartItems.map((item) => item.bike_id)],
    (err, itemDetails) => {
      if (err) {
        console.error("Помилка отримання інформації:", err);
        callback(err);
        return;
      }

      let subtotal = 0;
      selectedCartItems.forEach((item) => {
        const itemDetail = itemDetails.find(
          (detail) => detail.bike_id === item.bike_id,
        );

        const discount = parseFloat(itemDetail.discount_percentage) || 0;
        const originalPrice = parseFloat(itemDetail.bike_price);
        const discountedPrice = originalPrice * (1 - discount);
        const itemTotal = discountedPrice * item.quantity;
        subtotal += itemTotal;

        let startX = 50;
        const currentY = doc.y;

        doc.font("Roboto-Regular");
        doc.text(itemDetail.bike_model, startX, currentY, { width: 200 });

        startX += 200;
        doc.text(item.quantity.toString(), startX, currentY, {
          width: 80,
          align: "center",
        });

        startX += 80;
        doc.text(
          `${originalPrice.toFixed(2)} грн (${discountedPrice.toFixed(2)} грн)`,
          startX,
          currentY,
          {
            width: 100,
            align: "center",
          },
        );

        startX += 100;
        doc.text(`${itemTotal.toFixed(2)} грн`, startX, currentY, {
          width: 100,
          align: "right",
        });

        doc.moveDown();
      });

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      doc.font("Roboto-Bold");
      doc.x = 50;
      doc.text(`Проміжний підсумок: ${subtotal} грн`, { align: "left" });
      doc.x = 50;
      doc.text(`Доставка: ${parseFloat(orderDetails.deliveryPrice)} грн`, {
        align: "left",
      });
      doc.x = 50;
      doc.text(
        `Всього: ${subtotal + parseFloat(orderDetails.deliveryPrice)} грн`,
        { align: "left" },
      );
      doc.moveDown();
      doc.moveDown();
      doc
        .font("Roboto-Regular")
        .fontSize(10)
        .text(`Чек створено: ${new Date().toLocaleString("uk-UA")}`, {
          align: "center",
        });

      doc.end();

      stream.on("finish", () => {
        callback(null, receiptFilename);
      });
    },
  );
};

const createOrder = (orderData, selectedCartItems, callback) => {
  const { paymentMethod, deliveryPrice, email } = orderData;

  queryDatabase("START TRANSACTION", [], (startErr) => {
    if (startErr) return callback(startErr);

    const getCurrentCart =
      "SELECT cart_id FROM bike_store.cart WHERE user_email = ? ORDER BY cart_created_at";

    queryDatabase(getCurrentCart, [email], (cartErr, cartResult) => {
      if (cartErr) {
        queryDatabase("ROLLBACK", [], () => callback(cartErr));
        return;
      }

      const cartId = cartResult[0].cart_id;

      const calculateTotalPrice = (items, done) => {
        let totalBikePrice = 0;
        let uniqueBikeCount = 0;

        const processItem = (index) => {
          if (index >= items.length) {
            done(null, {
              totalBikePrice,
              uniqueBikeCount,
              totalPrice: totalBikePrice + parseFloat(deliveryPrice),
            });
            return;
          }

          const item = items[index];
          const priceQuery = `
            SELECT 
              b.bike_price * ? AS item_total_price, 
              COALESCE(p.discount_percentage, 0) AS discount_percentage
            FROM bike_store.bike b
            LEFT JOIN bike_store.promotion p 
              ON b.promotion_id = p.promotion_id AND p.promotion_end_date > NOW()
            WHERE b.bike_id = ?
          `;

          queryDatabase(
            priceQuery,
            [item.quantity, item.bike_id],
            (priceErr, priceResult) => {
              if (priceErr) {
                done(priceErr);
                return;
              }

              const itemPrice = priceResult[0];
              const discountedPrice =
                parseFloat(itemPrice.item_total_price) *
                (1 - parseFloat(itemPrice.discount_percentage));

              totalBikePrice += discountedPrice;
              uniqueBikeCount++;

              processItem(index + 1);
            },
          );
        };

        processItem(0);
      };

      calculateTotalPrice(selectedCartItems, (priceErr, priceCalc) => {
        if (priceErr) {
          queryDatabase("ROLLBACK", [], () => callback(priceErr));
          return;
        }

        // Insert order
        const insertOrderQuery =
          "INSERT INTO bike_store.order (order_date, payment_method, order_status, delivery_price, total_price, user_email) VALUES (NOW(), ?, 'Очікується', ?, ?, ?)";

        queryDatabase(
          insertOrderQuery,
          [paymentMethod, deliveryPrice, priceCalc.totalPrice, email],
          (orderErr, orderResult) => {
            if (orderErr) {
              queryDatabase("ROLLBACK", [], () => callback(orderErr));
              return;
            }

            const orderId = orderResult.insertId;

            // Process each selected cart item
            const processCartItems = (index) => {
              if (index >= selectedCartItems.length) {
                // All items processed, commit transaction
                queryDatabase("COMMIT", [], (commitErr) => {
                  if (commitErr) return callback(commitErr);

                  // Generate receipt (your existing logic)
                  generatePDFReceipt(
                    {
                      orderId,
                      paymentMethod,
                      deliveryPrice,
                      totalPrice: priceCalc.totalPrice,
                      email,
                    },
                    selectedCartItems,
                    (pdfErr, receiptFilename) => {
                      if (pdfErr) {
                        console.error("PDF generation error:", pdfErr);
                      }

                      callback(null, {
                        orderId,
                        totalPrice: priceCalc.totalPrice,
                        bikeTotalPrice: priceCalc.totalBikePrice,
                        deliveryPrice,
                        uniqueBikeCount: priceCalc.uniqueBikeCount,
                        receiptFilename,
                      });
                    },
                  );
                });
                return;
              }

              const item = selectedCartItems[index];

              const insertBikeCartOrderQuery = `
                INSERT INTO bike_store.bike_cart_order 
                (order_id, bike_cart_id, quantity) 
                SELECT ?, bike_cart_id, ? 
                FROM bike_store.bike_cart 
                WHERE cart_id = ? AND bike_id = ? AND bike_cart_status = 'Активний'
              `;

              queryDatabase(
                insertBikeCartOrderQuery,
                [orderId, item.quantity, cartId, item.bike_id],
                (bikeCartOrderErr) => {
                  if (bikeCartOrderErr) {
                    queryDatabase("ROLLBACK", [], () =>
                      callback(bikeCartOrderErr),
                    );
                    return;
                  }

                  const updateBikeCartQuery1 = `
                  UPDATE bike_store.bike_cart 
                  SET 
                    quantity = quantity - ? 
                  WHERE cart_id = ? AND bike_id = ? AND bike_cart_status = 'Активний' AND bike_cart_id = ?;
                  `;

                  queryDatabase(
                    updateBikeCartQuery1,
                    [item.quantity, cartId, item.bike_id, item.bike_cart_id],
                    (updateErr1) => {
                      if (updateErr1) {
                        queryDatabase("ROLLBACK", [], () =>
                          callback(updateErr1),
                        );
                        return;
                      }

                      const updateBikeCartQuery2 = `
                      UPDATE bike_store.bike_cart 
                      SET 
                        bike_cart_status = CASE 
                        WHEN quantity > 0 THEN 'Активний' 
                        ELSE 'Архівований' 
                        END
                      WHERE cart_id = ? AND bike_id = ? AND bike_cart_status = 'Активний' AND bike_cart_id = ?;
                      `;

                      queryDatabase(
                        updateBikeCartQuery2,
                        [cartId, item.bike_id, item.bike_cart_id],
                        (updateErr2) => {
                          if (updateErr2) {
                            queryDatabase("ROLLBACK", [], () =>
                              callback(updateErr2),
                            );
                            return;
                          }

                          processCartItems(index + 1);
                        },
                      );
                    },
                  );
                },
              );
            };

            processCartItems(0);
          },
        );
      });
    });
  });
};
const getOrderHistory = (
  userEmail,
  sortBy,
  sortOrder,
  paymentFilter,
  statusFilter,
  callback,
) => {
  let query = `SELECT * FROM bike_store.order WHERE user_email = ?`;
  const queryParams = [userEmail];

  if (paymentFilter && paymentFilter !== "all") {
    query += ` AND payment_method = ?`;
    queryParams.push(paymentFilter);
  }

  if (statusFilter && statusFilter !== "all") {
    query += ` AND order_status = ?`;
    queryParams.push(statusFilter);
  }

  if (sortBy === "date") {
    query += ` ORDER BY order_date ${sortOrder === "desc" ? "DESC" : "ASC"}`;
  } else if (sortBy === "price") {
    query += ` ORDER BY CAST(total_price AS DECIMAL) ${
      sortOrder === "desc" ? "DESC" : "ASC"
    }`;
  }

  queryDatabase(query, queryParams, callback);
};

const cancelOrder = (orderId, callback) => {
  const query = `
    UPDATE bike_store.order 
    SET order_status = 'Відмінено' 
    WHERE order_id = ? AND order_status = 'Очікується'
  `;
  queryDatabase(query, [orderId], callback);
};

module.exports = {
  createOrder,
  getOrderHistory,
  cancelOrder,
};
