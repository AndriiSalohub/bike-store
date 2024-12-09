const { queryDatabase } = require("../db/db");

const getAllBrands = (callback) => {
  const query = "SELECT * FROM bike_store.brand WHERE brand_deleted_at IS NULL";

  queryDatabase(query, [], callback);
};

const getBrandById = (brandId, callback) => {
  const query = "SELECT * FROM bike_store.brand WHERE brand_id = ?";

  queryDatabase(query, [brandId], callback);
};

const updateBrand = (brandId, newBrand, callback) => {
  const query = "UPDATE bike_store.brand SET ? WHERE brand_id = ?";

  queryDatabase(query, [newBrand, brandId], callback);
};

const softDeleteBrand = (brandId, callback) => {
  queryDatabase("START TRANSACTION", [], (transactionErr) => {
    if (transactionErr) {
      return callback(transactionErr, null);
    }

    queryDatabase(
      "UPDATE bike_store.brand SET brand_deleted_at = CURRENT_TIMESTAMP WHERE brand_id = ?",
      [brandId],
      (typeUpdateErr) => {
        if (typeUpdateErr) {
          return queryDatabase("ROLLBACK", [], () => {
            callback(typeUpdateErr, null);
          });
        }

        queryDatabase(
          "UPDATE bike_store.bike SET bike_deleted_at = CURRENT_TIMESTAMP WHERE brand_id = ?",
          [brandId],
          (bikeUpdateErr) => {
            if (bikeUpdateErr) {
              return queryDatabase("ROLLBACK", [], () => {
                callback(bikeUpdateErr, null);
              });
            }

            queryDatabase("COMMIT", [], (commitErr) => {
              if (commitErr) {
                return queryDatabase("ROLLBACK", [], () => {
                  callback(commitErr, null);
                });
              }

              callback(null, { message: "Soft delete successful" });
            });
          },
        );
      },
    );
  });
};

const addBrand = (brandName, callback) => {
  const query = "INSERT INTO bike_store.brand (brand_name) VALUES (?)";

  queryDatabase(query, [brandName], callback);
};

const getDeletedBrands = (callback) => {
  const query =
    "SELECT * FROM bike_store.brand WHERE brand_deleted_at IS NOT NULL";

  queryDatabase(query, [], callback);
};

// Відновлення бренду і видалених велосипедів цього бренду
const restoreBrand = (brandId, callback) => {
  queryDatabase("START TRANSACTION", [], (transactionErr) => {
    if (transactionErr) {
      return callback(transactionErr, null);
    }

    queryDatabase(
      "UPDATE bike_store.brand SET brand_deleted_at = NULL WHERE brand_id = ?",
      [brandId],
      (brandRestoreErr) => {
        if (brandRestoreErr) {
          return queryDatabase("ROLLBACK", [], () => {
            callback(brandRestoreErr, null);
          });
        }

        queryDatabase(
          `UPDATE bike_store.bike b
           INNER JOIN bike_store.type t ON b.type_id = t.type_id
           SET b.bike_deleted_at = NULL
           WHERE b.brand_id = ? AND t.type_deleted_at IS NULL`,
          [brandId],
          (bikeRestoreErr) => {
            if (bikeRestoreErr) {
              return queryDatabase("ROLLBACK", [], () => {
                callback(bikeRestoreErr, null);
              });
            }

            queryDatabase("COMMIT", [], (commitErr) => {
              if (commitErr) {
                return queryDatabase("ROLLBACK", [], () => {
                  callback(commitErr, null);
                });
              }

              callback(null, { message: "Успішне відновлення бренду" });
            });
          },
        );
      },
    );
  });
};

// Відновлення лише бренду
// const restoreType = (brandId, callback) => {
//   queryDatabase("START TRANSACTION", [], (transactionErr) => {
//     if (transactionErr) {
//       return callback(transactionErr, null);
//     }
//     queryDatabase(
//       "UPDATE bike_store.brand SET brand_deleted_at = NULL WHERE brand_id = ?",
//       [brand_id],
//       (brandRestoreErr) => {
//         if (brandRestoreErr) {
//           return queryDatabase("ROLLBACK", [], () => {
//             callback(brandRestoreErr, null);
//           });
//         }
//         queryDatabase("COMMIT", [], (commitErr) => {
//           if (commitErr) {
//             return queryDatabase("ROLLBACK", [], () => {
//               callback(commitErr, null);
//             });
//           }
//           callback(null, { message: "Бренд успішно відновлено" });
//         });
//       },
//     );
//   });
// };

module.exports = {
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
  addBrand,
  getDeletedBrands,
  restoreBrand,
};
