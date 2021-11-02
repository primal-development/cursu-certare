require('dotenv').config()

var express = require('express');
var app = express();
var port = 80;


app.listen(port);

app.use(express.static(__dirname + '/public'));