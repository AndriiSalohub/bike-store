const { queryDatabase } = require("../db/db.js");

const getAllUsernames = (username, callback) => {
  const query = "SELECT * FROM bike_store.user WHERE user_name = ?";

  queryDatabase(query, [username], callback);
};

const getAllEmails = (email, callback) => {
  const query = "SELECT * FROM bike_store.user WHERE user_email = ?";
  queryDatabase(query, [email], callback);
};

const addUser = (newUser, callback) => {
  const query =
    "INSERT INTO bike_store.user (user_email, user_password, user_role, user_name) VALUES(?, ?, ?, ?)";

  queryDatabase(query, newUser, callback);
};

const getUser = (username, email, callback) => {
  const query =
    "SELECT * FROM bike_store.user WHERE (user_name = ? OR user_email = ?)";

  queryDatabase(query, [username, email], callback);
};

module.exports = {
  getAllUsernames,
  getAllEmails,
  getUser,
  addUser,
};
