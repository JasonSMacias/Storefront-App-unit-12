// requiring packages
require("dotenv").config();

const inquirer = require("inquirer");

const mysql = require("mysql");

const cTable = require("console.table");

let itemNumbers = [];

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
    for (var x in result) {
      console.log([
        result[x].item_id, result[x].product_name, result[x].price
      ]);
      itemNumbers.push(result[x].item_id);
    };

  console.log(itemNumbers);
  beginPrompt();
  });
};
function beginPrompt(){
  inquirer.prompt([
    {
      name: "Choose item",
      type: "input",
      message: "Please select the item number of the item you would like to order",
    },
    {
      name: "Choose another item",
      type: "input",
      message: "Please select another",
    },
  ])
  .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid === "POST") {
        postAuction();
      }
      else if(answer.postOrBid === "BID") {
        bidAuction();
      } else{
        connection.end();
      }
    });
};