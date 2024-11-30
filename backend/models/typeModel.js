const { queryDatabase } = require("../db/db");

const getAllTypes = (callback) => {
  const query = "SELECT * FROM bike_store.type";

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

const deleteType = (typeId, callback) => {
  const query = "DELETE FROM bike_store.type WHERE type_id = ?";

  queryDatabase(query, [typeId], callback);
};

module.exports = {
  getAllTypes,
  getTypeById,
  updateType,
  deleteType,
};
