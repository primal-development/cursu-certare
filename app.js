require('dotenv').config();
var bodyParser = require("body-parser");
var express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const mariadb = require('mariadb');

let httpsEnabled = false;


// Enable https only when all the files are provided
if(envIsDefined(process.env.HTTPS_PRIVKEY_PATH) && envIsDefined(process.env.HTTPS_CERT_PATH) && envIsDefined(HTTPS_CA_PATH)) {
  httpsEnabled = true;
}

let credentials = null;
if(httpsEnabled) {
  console.log("✅ https enabled");
  // Certificates
  const privateKey = fs.readFileSync(process.env.HTTPS_PRIVKEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH, 'utf8');
  const ca = fs.readFileSync(process.env.HTTPS_CA_PATH, 'utf8');
  credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
}else{
  console.log("⚠️ https not enabled (missing private key, cert or ca files)");
}


var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.enable('trust proxy')

const mariadb_url = process.env.MARIADB_URL;
const mariadb_user = process.env.MARIADB_USER;

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


const pool = mariadb.createPool({
  host: mariadb_url,
  user: mariadb_user,
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

async function disconnect(conn) {
  conn.end();
}


async function testconnection() {
  connect().then(conn => {
    conn.query('USE strava');
    conn.query('SELECT * FROM Testuser').then((res) => {
      console.log(res);
      disconnect(conn);
    })
  });
}

async function insertnewuser(athlete_id, refresh_token, first_name, last_name) {
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



app.use(express.static(__dirname + '/public'));

/*
// set up a route to redirect http to https
app.get('*', function (req, res) {
  console.log("Test")
  res.redirect('https://stravatest.ddns.net' + req.url);

  // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
  // res.redirect('https://example.com' + req.url);
})
*/



const data = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
};

app.get('/api', (request, response) => {
  response.json(data);
  console.log("Test");
});

app.post("/key", (request, response) => {
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
      res.json({ "hub.challenge": challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function envIsDefined(env_string) {
  if(env_string === "" || env_string === null) {
    return false;
  }
  return true;
}

// Starting http server & https servers (if credentials are given)
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
  console.log('✅ HTTP Server running on port 80');
});

if(httpsEnabled){
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log('✅ HTTPS Server running on port 443');
  });
}
