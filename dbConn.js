// const mysql = require('mysql2');
import mysql from 'mysql2'
// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',    // Your database host
  user: 'root',         // Your database user
  password:'', // Your database password
  database: 'book_Database' // Your database name
});

// Export the pool connection
// module.exports = pool.promise();
export default pool.promise();