'use strict';

(function(){
	var inquirer = require("inquirer");
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
			case "Manger":
				BamazonManager.start();
				break;
			case "Supervisor":
				BamazonSupervisor.start();
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
						console.log(res.length)
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
})();