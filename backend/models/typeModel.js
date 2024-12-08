const { queryDatabase } = require("../db/db");

const getAllTypes = (callback) => {
  const query = "SELECT * FROM bike_store.type WHERE type_deleted_at IS NULL";

  queryDatabase(query, [], callback);
};

const getTypeById = (typeId, callback) => {
  const query = "SELECT * FROM bike_store.type WHERE type_id = ?";

  queryDatabase(query, [typeId], callback);
};

const updateType = (typeId, newType, callback) => {
  const query = "UPDATE bike_store.type SET ? WHERE type_id = ?";

  queryDatabase(query, [newType, typeId], callback);
};

const softDeleteType = (typeId, callback) => {
  queryDatabase("START TRANSACTION", [], (transactionErr) => {
    if (transactionErr) {
      return callback(transactionErr, null);
    }

    queryDatabase(
      "UPDATE bike_store.type SET type_deleted_at = CURRENT_TIMESTAMP WHERE type_id = ?",
      [typeId],
      (typeUpdateErr) => {
        if (typeUpdateErr) {
          return queryDatabase("ROLLBACK", [], () => {
            callback(typeUpdateErr, null);
          });
        }

        queryDatabase(
          "UPDATE bike_store.bike SET bike_deleted_at = CURRENT_TIMESTAMP WHERE type_id = ?",
          [typeId],
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

const addType = (typeName, callback) => {
  const query = "INSERT INTO bike_store.type (type_name) VALUES (?)";

  queryDatabase(query, [typeName], callback);
};

const getDeletedTypes = (callback) => {
  const query =
    "SELECT * FROM bike_store.type WHERE type_deleted_at IS NOT NULL";

  queryDatabase(query, [], callback);
};

// Відновлення типу і велосипедів з таким типом
const restoreType = (typeId, callback) => {
  queryDatabase("START TRANSACTION", [], (transactionErr) => {
    if (transactionErr) {
      return callback(transactionErr, null);
    }
    queryDatabase(
      "UPDATE bike_store.type SET type_deleted_at = NULL WHERE type_id = ?",
      [typeId],
      (typeRestoreErr) => {
        if (typeRestoreErr) {
          return queryDatabase("ROLLBACK", [], () => {
            callback(typeRestoreErr, null);
          });
        }

        queryDatabase(
          `UPDATE bike_store.bike b
           INNER JOIN bike_store.brand br ON b.brand_id = br.brand_id
           SET b.bike_deleted_at = NULL
           WHERE b.type_id = ? AND br.brand_deleted_at IS NULL`,
          [typeId],
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

              callback(null, { message: "Успішне відновлення типу" });
            });
          },
        );
      },
    );
  });
};

// Відновлення лише типу
// const restoreType = (typeId, callback) => {
//   queryDatabase("START TRANSACTION", [], (transactionErr) => {
//     if (transactionErr) {
//       return callback(transactionErr, null);
//     }
//     queryDatabase(
//       "UPDATE bike_store.type SET type_deleted_at = NULL WHERE type_id = ?",
//       [typeId],
//       (typeRestoreErr) => {
//         if (typeRestoreErr) {
//           return queryDatabase("ROLLBACK", [], () => {
//             callback(typeRestoreErr, null);
//           });
//         }
//
//         queryDatabase("COMMIT", [], (commitErr) => {
//           if (commitErr) {
//             return queryDatabase("ROLLBACK", [], () => {
//               callback(commitErr, null);
//             });
//           }
//
//           callback(null, { message: "Тип успішно відновлено" });
//         });
//       },
//     );
//   });
// };

module.exports = {
  getAllTypes,
  getTypeById,
  updateType,
  softDeleteType,
  addType,
  getDeletedTypes,
  restoreType,
};
