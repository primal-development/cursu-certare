require('dotenv').config()

// express und http Module importieren. Sie sind dazu da, die HTML-Dateien
// aus dem Ordner "public" zu veröffentlichen.
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 80;

// Mit diesem Kommando starten wir den Webserver.
server.listen(port, function () {
// Wir geben einen Hinweis aus, dass der Webserer läuft.
console.log('Webserver läuft und hört auf Port %d', port);
});

// Hier teilen wir express mit, dass die öffentlichen HTML-Dateien
// im Ordner "public" zu finden sind.
app.use(express.static(__dirname + '/public'));

// Fertig. Wir haben unseren ersten, eigenen Webserver programmiert :-)

/*
let express = require("express");
let app = express();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;


//assuming app is express Object.
app.get('/',function(req,res) {
    res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/redirect.html');
    res.sendFile(__dirname + '/redirect.js');
  });
//authorize();

app.listen(80, () => {
    console.log("Server running on port 80");
});*/