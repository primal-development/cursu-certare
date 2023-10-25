require("dotenv").config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: 'demez.asuscomm.com', 
     user:'silo', 
     password: process.env.MARIADB_PW,
     connectionLimit: 5
});

async function connect() {
    let conn;
    try {
      return await pool.getConnection();
    //return conn;
  
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }
  
async function disconnect(conn){
    conn.end();
}

module.exports = {connect, disconnect};
