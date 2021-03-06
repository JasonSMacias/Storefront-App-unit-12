// requiring packages
require("dotenv").config();

const inquirer = require("inquirer");

const mysql = require("mysql");

const cTable = require("console.table");

let itemNumbers = [];

let enough;

let orderInformation;

let orderedItem;

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

  
  beginPrompt();
  });
};

function beginPrompt(){
  inquirer.prompt([
    {
      name: "item",
      type: "input",
      message: "Please select the item number of the item you would like to order",
    },
    {
      name: "units",
      type: "input",
      message: "How many units would you like to buy",
    },
  ])
  .then(function(answer) {
    if (answer.item > 0 && answer.item < 11){
      console.log(`\nyou ordered ${answer.units} units of item ${answer.item}.`);
      checkStock(answer);
    }
    else {
      console.log("Please enter a valid item number.");
      beginPrompt();
    };
  });
};

let checkStock = async function(order) {
  
  if(!Number.isInteger(parseInt(order.units))) {
    
    orderResolve("try again");
    return false;
  };


  connection.query("SELECT * FROM products WHERE item_id = ?", [order.item],
  function (err, results) {
    if (err) throw err;
    
    // console.log("\norder units: "+order.units);
    // console.log("\nstock quantity: "+results[0].stock_quantity);
    enough = results[0].stock_quantity - order.units;
  
    orderInformation = order;
    orderedItem = results[0];
    returnFunction();
  });
  
  function returnFunction(){
   
    if (enough > 0){
      orderResolve(true);
    }
    else {
      orderResolve(false);
    };
  };

};

function orderResolve(value){
  if (value === true) {
    console.log("\nYour order has been placed, thanks for your business.");
    databaseUpdate();
  }
  else if (value === "try again"){
    console.log("\nPlease enter a valid number of units to order.");
    beginPrompt();
  }
  else if(value === false){
    console.log("\nWe're sorry, we do not have sufficient stock to cover that order :-(");
    disconnect();
  };
};

function databaseUpdate(){

  console.table(orderInformation);
  console.table(orderedItem);
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
     {
       stock_quantity: enough
     },
     {
       item_id: orderInformation.item
     }
    ],
    function(err) {
      if (err) throw err;
      
    }
  );
  console.log("\nNew stock quantity :"+enough);
  console.log("\nYour bill is: $"+(orderedItem.price * orderInformation.units));
  disconnect();
};

function disconnect() {
  connection.end(function (err) {
    console.log("Goodbye :-)")
  })
};