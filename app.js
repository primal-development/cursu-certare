require('dotenv').config();
var bodyParser = require("body-parser");
var express = require('express');
const { request, response } = require('express');
const cors = require('cors');


var app = express();
var port = 80;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'demez.asuscomm.com', 
     user:'silo', 
     password: process.env.MARIADB_PW,
     connectionLimit: 5
});


//connect();

async function connect() {
  let conn, query;
  try {
	conn = await pool.getConnection();

  query = 'USE strava';
  let res = await conn.query(query);
  console.log("Test" + res);
  query = 'SELECT first_name, last_name from Testuser WHERE userID = 1';
  res = await conn.query(query);
  console.log(res);
  conn.end();

  /*
	const rows = await conn.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
*/

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}





app.listen(port);

app.use(express.static(__dirname + '/public'));

const data = {
   client_id:  process.env.CLIENT_ID,
   client_secret: process.env.CLIENT_SECRET
};

app.get('/api', (request, response) => {
  response.json(data);
  console.log("Test");
});

app.post("/key", (request,response) => {
  console.log("Ricevuto una richiesta POST");
  // contenuto della richiesta
  console.log(request.body);
  // username
  console.log(request.body.athelete_id);
  // password
  console.log(request.body.refresh_token);
});