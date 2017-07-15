CREATE TABLE products(
	item_id integer(10) auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(50),
    price decimal(6,2),
    stock_quantity integer(6) default 0,
	PRIMARY KEY (item_id)	
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Item 4', 'Department 2', '13', '223');
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Item 5', 'Department 3', '14', '24');
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Item 6', 'Department 3', '15', '25');

CREATE TABLE departments(
	department_id integer(10) auto_increment not null,
    department_name varchar(50),
    over_head_costs decimal(6,2),
	PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES ('Department 2', 2.5);
INSERT INTO departments (department_name, over_head_costs) VALUES ('Department 3', 3.75);
INSERT INTO departments (department_name, over_head_costs) VALUES ('Department 4', 1.25);

--Check inventory
SELECT
    stock_quantity
FROM products
WHERE 0=0
and item_id = 

--Update Inventory
UPDATE products
SET stock_quantity = 
WHERE 0=0
and item_id = 

--Manager Reports

--View Products
SELECT 
    item_id as 'Item ID'
    ,product_name as 'Product Name'
    ,price as 'Price'
    ,stock_quantity as 'Quantity'
FROM products
WHERE 0=0
ORDER BY item_id

--View Low Inventory
SELECT 
    item_id as 'Item ID'
    ,product_name as 'Product Name'
    ,price as 'Price'
    ,stock_quantity as 'Quantity'
FROM products
WHERE 0=0
AND quantity <= 5
ORDER BY item_id

--Update quantity
UPDATE products
SET stock_quantity = 
WHERE 0=0
and item_id = 

--Add New Item
INSERT INTO products (
    product_name, 
    department_name,
    price, 
    stock_quantity)
VALUES (
    'Item 4', 
    'Department 2', 
    '13', 
    '223'
);

--Departments
ALTER TABLE products
ADD product_sales decimal(11,2)
