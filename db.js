const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Workout-Logger",
  password: "postgres",
  port: 5432,
});

// client.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to database!");
// });

// function query(q, params, callback) {
//   client.query(q, params, (err, result) => {
//     if (err) throw err;
//     callback(result.rows);
//   });
// }

module.exports = {
  pool
};
