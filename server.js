const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

var app = express();


app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: "192.168.1.4",
    user: "root",
    password: "raspberry",
    database: "test",
    multipleStatements: true
})

mysqlConnection.connect((err)=>{
    if(!err)
        {
            console.log("Connection succesful")
        }
    else
        {
            console.log("Connection failed");
        }    
})

app.listen(80);