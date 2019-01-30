// requiring packages
require("dotenv").config();

const inquirer = require("inquirer");

const mysql = require("mysql");

const cTable = require("console.table");

// variable storing password from .env
const localDBPW = process.env.MYSQL_PW

// connecting to database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  // password from .env
  password: localDBPW,
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startFunction();
});

function startFunction() {
  connection.query("SELECT * FROM products", function (err, result) {
    if (err) throw (err);

    console.log("Available products\n");
    for (var x in result){
      console.log([
        result[x].item_id, result[x].product_name, result[x].price]);
    };
    
    connection.end();
  });
};