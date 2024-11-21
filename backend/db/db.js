const mysql2 = require("mysql2");

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "11111111",
  database: "bike_store",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});
