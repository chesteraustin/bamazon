CREATE TABLE products(
	item_id integer(10) auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(50),
    price decimal(6,2),
    stock_quantity integer(6) default 0,
	PRIMARY KEY (item_id)	
);