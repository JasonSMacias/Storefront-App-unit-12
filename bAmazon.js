require("dotenv").config();

const localDBPW = process.env.MYSQL_PW

const inquirer = require("inquirer");

const mysql = require("mysql");

