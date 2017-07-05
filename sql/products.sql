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

