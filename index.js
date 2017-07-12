'use strict';

(function(){
	var inquirer = require("inquirer");
	require("console.table");
	var database = require("./database");
	var BamazonCustomer = require("./bamazonCustomer");
	var BamazonManager = require("./bamazonManager");
	var BamazonSupervisor = require("./bamazonSupervisor");

startBamazon();
function startBamazon() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "Please select a role",
		choices: [
			"Customer",
			"Manager",
			"Supervisor"
		]
	})
	.then(function(answer) {
		switch (answer.action) {
			case "Customer":
				customerStart();
				break;
			case "Manager":
				managerStart();
				break;
			case "Supervisor":
				supervisorStart();
				break;
			default:
				console.log('Please select a role')
				startBamazon();
			}
	});
}

function customerStart() {
	//Start customer
	database.connect(function(err) {
		//Query products to get list of items
		var query = "SELECT product_name FROM products";

		//Pass to MySQL
		database.query(query, function(err, res) {
			var productListing = [];

			for (var i = 0; i < res.length; i++) {
				//Append to productListing array for use for inquirer prompt
				productListing.push(res[i].product_name);
			}

			var customerQuestions = [
				{
					name: "selection",
					type: "list",
					message: "Please select a product to purchase",
					choices: productListing
				},
				{
					name: "quantity",
					type: "input",
					message: "How many items do you wish to purchase?",
					validate: function (value) {
						var valid = !isNaN(parseFloat(value));
						return valid || 'Please enter a number';
					}
				}
			]
			inquirer.prompt(customerQuestions)
			.then(function(customerAnswer) {
				//Once selected, check if inventory exists
					var query = "SELECT product_name, stock_quantity FROM products WHERE product_name = ? AND stock_quantity >= ?";
					database.query(query, [customerAnswer.selection, parseInt(customerAnswer.quantity)], function(err, res) {
						//If sufficient inventory, then update quantity and show cost of purchase
						if (res.length > 0) {
							var newQuantity = res[0].stock_quantity - parseInt(customerAnswer.quantity);

							query = "UPDATE products SET stock_quantity = ? WHERE product_name = ?" ;
							database.query(query, [newQuantity, customerAnswer.selection], function(err2, res2){
								console.log(`${res[0].product_name} was ordered.  There are ${newQuantity} items left.`)
								startBamazon();
							})
						}
						else {
						//If not, no order placed
							console.log(`There is not enough ${customerAnswer.selection} inventory for your order.  Please order an amount less than ${customerAnswer.quantity}.`)
							customerStart();
						}
					})
			})
		});
	});




}

function managerStart(){
	//Show menu items
	var managerQuestions = [
		{
			name: "selection",
			type: "list",
			message: "Please select a task",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add new Product"
			]
		}
	]
	inquirer.prompt(managerQuestions)
	.then(function(managerAnswers){
		switch (managerAnswers.selection) {
			case "View Products for Sale":
				viewProducts();
				break;
			case "View Low Inventory":
				viewLowInventory();
				break;
			case "Add to Inventory":
				addToInventory();
				break;
			case "Add new Product":
				addNewProduct();
				break;
			default:
				console.log('Please select a task')
				managerStart();
			}
	})

}

function viewProducts(){
	var query = "SELECT item_id as 'Item ID', product_name as 'Product Name', stock_quantity as 'Quantity', price as 'Price' FROM products ORDER BY item_id";
	database.query(query, function(err, res) {
		console.table(res)
		managerStart();
	})
}

function viewLowInventory(){
	var query = "SELECT item_id as 'Item ID', product_name as 'Product Name', stock_quantity as 'Quantity', price as 'Price' FROM products WHERE stock_quantity <= 5 ORDER BY item_id";
	database.query(query, function(err, res) {
		if (res.length > 0) {
			console.table(res)
		}
		else {
			console.log("No low inventory right now!")
		}
		managerStart();
	})
}

function addToInventory(){
	//Find out what items to add to inventory
	database.connect(function(err) {
		//Query products to get list of items
		var query = "SELECT product_name FROM products";

		//Pass to MySQL
		database.query(query, function(err, res) {
			var productListing = [];

			for (var i = 0; i < res.length; i++) {
				//Append to productListing array for use for inquirer prompt
				productListing.push(res[i].product_name);
			}

			var managerQuestions = [
				{
					name: "selection",
					type: "list",
					message: "Please select a product to add inventory to.",
					choices: productListing
				},
				{
					name: "quantity",
					type: "input",
					message: "How many items do you wish to add?",
					validate: function (value) {
						var valid = !isNaN(parseFloat(value));
						return valid || 'Please enter a number';
					}
				}
			]
			inquirer.prompt(managerQuestions)
			.then(function(managerAnswer) {
				var query = "SELECT product_name, stock_quantity FROM products WHERE product_name = ?";
				database.query(query, [managerAnswer.selection], function(err, res) {
					var newQuantity = res[0].stock_quantity + parseInt(managerAnswer.quantity);

					query = "UPDATE products SET stock_quantity = ? WHERE product_name = ?" ;
					database.query(query, [newQuantity, managerAnswer.selection], function(err2, res2){
						console.log(`${managerAnswer.selection} has increased in invetory.  There are ${newQuantity} items left.`)
						managerStart();
					})
				})
			})
		})
	})	
}

function addNewProduct(){
	var managerQuestions = [
		{
			name: "product_name",
			type: "input",
			message: "What is the name of the product?"
		},
		{
			name: "department_name",
			type: "input",
			message: "What department does it belong to?"
		},
		{
			name: "price",
			type: "input",
			message: "What is its' price?",
			validate: function (value) {
				var valid = !isNaN(parseFloat(value));
				return valid || 'Please enter a number';
			}

		},
		{
			name: "stock_quantity",
			type: "input",
			message: "What is the initial inventory?",
			validate: function (value) {
				var valid = !isNaN(parseFloat(value));
				return valid || 'Please enter a number';
			}
		}
	]
	inquirer.prompt(managerQuestions)
	.then(function(managerAnswer) {
		var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)";
		database.query(query, [managerAnswer.product_name, managerAnswer.department_name, managerAnswer.price, managerAnswer.stock_quantity], function(err, res) {
			console.log(`${managerAnswer.product_name} was added to the products table!`)
			managerStart();
		})
	})

}

function supervisorStart(){}

})();