// requiring packages
require("dotenv").config();

const inquirer = require("inquirer");

const mysql = require("mysql");

// variable storing password from .env
const localDBPW = process.env.MYSQL_PW

// connecting to database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  // password from .env
  password: "localDBPW",
  database: "bamazon"
});