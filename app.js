require('dotenv').config()

var express = require('express');
var app = express();
var port = 80;


app.listen(port);

app.use(express.static(__dirname + '/public'));

const data = {
   client_id:  process.env.CLIENT_ID,
   client_secret: process.env.CLIENT_SECRET
};

app.get('/api', (request, response) => {
  response.json(data);
});
