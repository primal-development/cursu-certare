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


// webhooks

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
  console.log("webhook event received!", req.query, req.body);
  res.status(200).send('EVENT_RECEIVED');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "abcdefgh";
  // Parses the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.json({"hub.challenge":challenge});  
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});