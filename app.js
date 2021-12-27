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


//connect1();

async function connect1() {
  let conn, query;
  try {
	conn = await pool.getConnection();

  query = 'USE strava';
  let res = await conn.query(query);
  console.log("Test" + res);
  query = 'SELECT first_name, last_name from Testuser WHERE athleteID = 24473138';
  res = await conn.query(query);
  console.log(res);
  conn.end();

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

async function connect() {
  let conn;
  try {
	return await pool.getConnection();
  //return conn;

  query = 'USE strava';
  let res = await conn.query(query);
  console.log("Test" + res);
  query = 'SELECT first_name, last_name from Testuser WHERE athleteID = 24473138';
  res = await conn.query(query);
  console.log(res);
  conn.end();

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

async function sendQuery(conn, query){
  return await conn.query(query)
}

async function disconnect(conn){
  conn.end();
}


async function testconnection(){
  connect().then(conn => {
    conn.query('USE strava');
    conn.query('SELECT * FROM Testuser').then((res) => {
      console.log(res);
      disconnect(conn);
    })
  });
}

async function insertnewuser(athlete_id, refresh_token, first_name, last_name){
  connect().then(conn => {
    conn.query('USE strava');
    console.log("REPLACE INTO Testuser SET athleteID=" + athlete_id + ", first_name='" + first_name + "', last_name='" + last_name + "', refresh_token='" + refresh_token + "';");
    conn.query("REPLACE INTO Testuser SET athleteID=" + athlete_id + ", first_name='" + first_name + "', last_name='" + last_name + "', refresh_token='" + refresh_token + "';");
    conn.query('SELECT * FROM Testuser').then((res) => {
      console.log(res);
      disconnect(conn);
    })
  });
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
  console.log(request.body.athlete_id);
  // password
  console.log(request.body.refresh_token);
  insertnewuser(request.body.athlete_id, request.body.refresh_token, request.body.first_name, request.body.last_name);
});


//testconnection();