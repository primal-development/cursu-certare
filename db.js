require("dotenv").config();
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: mariadb_url,
  user: mariadb_user,
  password: process.env.MARIADB_PW,
  connectionLimit: 5,
});

async function connect() {
  // Abort programm if no database connection string is provided
  if (!envIsDefined(mariadb_url)) {
    console.error("❌ No database connection string provided");
    console.error("exiting...");
    process.exit(1);
  }

  // Abort programm if no database user is provided
  if (!envIsDefined(mariadb_user)) {
    console.error("❌ No database user provided");
    console.error("exiting...");
    process.exit(1);
  }

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

async function disconnect(conn) {
  conn.end();
}

async function testconnection() {
  connect().then((conn) => {
    conn.query("USE strava");
    conn.query("SELECT * FROM Testuser").then((res) => {
      console.log(res);
      disconnect(conn);
    });
  });
}

async function insertnewuser(athlete_id, refresh_token, first_name, last_name) {
  connect().then((conn) => {
    conn.query("USE strava");
    console.log(
      "REPLACE INTO Testuser SET athleteID=" +
        athlete_id +
        ", first_name='" +
        first_name +
        "', last_name='" +
        last_name +
        "', refresh_token='" +
        refresh_token +
        "';"
    );
    conn.query(
      "REPLACE INTO Testuser SET athleteID=" +
        athlete_id +
        ", first_name='" +
        first_name +
        "', last_name='" +
        last_name +
        "', refresh_token='" +
        refresh_token +
        "';"
    );
    conn.query("SELECT * FROM Testuser").then((res) => {
      console.log(res);
      disconnect(conn);
    });
  });
}

module.exports = { connect, disconnect };
