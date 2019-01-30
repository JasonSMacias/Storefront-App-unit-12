DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(150) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10, 2) default 0,
  stock_quantity INTEGER(10) default 0,
  PRIMARY KEY (id)
);