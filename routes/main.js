module.exports = function(app){

	//validator
	const {check, validationResult} = require('express-validator');

    	//login redirect
	const redirectLogin = (req, res, next) => {
		//if a session ID hasn't been set (user isn't logged on), user is redirected to the login page     
		if (!req.session.userId) {      
			res.redirect('./login');
		} 
		else { 
			next(); 
		}    
	}

    	//home page 
	app.get('/', function(req, res){
        	res.render('index.html');
    	});

    	//about page
	app.get('/about',function(req,res){
        	res.render('about.html');
    	});

    	//register page 
    	app.get('/register', function (req,res){
		res.render('register.html');
	});

	//executed when the register form is submitted
	//checks that the email is valid, username is not empty, and password is of length 8 minimum 
    	app.post('/registered', [check('email').isEmail(), check('username').not().isEmpty(), check('password').isLength({min : 8})], function (req,res){
		//if the validation has errors, the user is directed back to the register page
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			res.redirect('./register');
		} 
		else{
			//connecting to database
			var MongoClient = require('mongodb').MongoClient;
			var url = 'mongodb://localhost';

			//sanitizing password and username 
			const plainPassword = req.sanitize(req.body.password);
                        const sanitizedUsername = req.sanitize(req.body.username);

			//hashing password 
			const bcrypt = require('bcrypt'); //inclusion of bycrypt module
			const saltRounds = 10; 	
			bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){ 
				MongoClient.connect(url, function(err, client) { 
					if (err) throw err; 
					var db = client.db ('calorieBuddy');
					//saving data to collection users 
					db.collection('users').insertOne({
						//key: value
						username: sanitizedUsername,
						password: hashedPassword,
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email
					});
					client.close();
				});
				//sending confirmation message by rendering empty ejs template with array of strings
				var message = ["Success!", "You are now registered.", "Your user name is: "+ sanitizedUsername, "Your hashed password is: "+ hashedPassword]; 
				res.render('confirmation.ejs', {messages: message});	
			});
		}
	});

    	//login page 
    	app.get('/login', function (req, res){
		res.render('login.html');
	});

	//exectuted when the login form has been submitted
	app.post('/loggedin', function (req, res){
		//connecting to database 
		var MongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost';

		const bcrypt = require('bcrypt'); //inclusion of bycrpt module 

		MongoClient.connect(url, function(err, client){
			if (err) throw err;
			var db = client.db ('calorieBuddy');
			const plainPassword = req.body.password;
			//searchind database for username 
			db.collection('users').find({"username": req.body.username}).toArray((findErr, results) =>{
				if (findErr) throw findErr;
				else{ 
					//checking that username has been found, if not sending an error message
					if(results.length==0){
						//message sent by rendering empty ejs template with array of strings
						var message = ["Failure", "Login unseccessful.", "Username incorrect, please try again."];
						res.render('confirmation.ejs', {messages: message});
					}
					else{
						//comparing entered password to hashed password in database 
						var hashedPassword = results[0].password;
						bcrypt.compare(plainPassword, hashedPassword, function(err, result){
							if (err) throw err;
							else{
								//checking is passwords don't match, if so sending an error message 
								if(result==false){
									var message = ["Failure", "Login unseccessful.", "Password incorrect, please try again."];
									res.render('confirmation.ejs', {messages: message});
								}
								else{
									//saving user session since login was successful   
									req.session.userId = req.body.username;
									//sending a confirmation by rendering empty ejs template with array of strings
									var message = ["Success!", "You are now logged in."];
									res.render('confirmation.ejs', {messages: message}); 
								}
							};
						});
					};
				};
			client.close();
			});
		});
	});

	//executed once 'logout' button on navigation bar is pressed 
    	app.get('/logout', redirectLogin, (req,res) => {
		req.session.destroy(err => {      
			if (err) {        
				return res.redirect('./')      
			}
			//sending a confirmation message by rendering empty ejs template with array of strings
			var message = ["Bye-bye", "You have been logged out.", "We hope to see you back soon!"];
			res.render('confirmation.ejs', {messages: message});      
		});  
	});

    	//add food page 
    	app.get('/addfood', redirectLogin, function (req, res){
		res.render('addfood.html');
	});

	//executed once add food form is submitted
	//checks that the 'name' value has not been left empty 
	app.post('/foodadded', check('name').not().isEmpty(), function(req, res){
		//if the validation has errors, the user is presented with a error message 
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			//message sent by rendering empty ejs template with array of strings
			var message = ["Failure", "This item was unable to be added to the database.", "Please check the name of the item has been entered."];
			res.render('confirmation.ejs', {messages: message});
		} 
		else{
			//connecting in database
			var MongoClient = require('mongodb').MongoClient;
			var url = 'mongodb://localhost';
			MongoClient.connect(url, function(err, client) {
				if (err) throw err;
				var db = client.db ('calorieBuddy');
				//inserting data to database collection 'food'
				db.collection('food').insertOne({
					//key: value
					name: req.body.name.toLowerCase(),
					typicalValues: req.body.typicalValues,
					unitTypicalValues: req.body.unitTypicalValues,
	                		calories: req.body.calories,
	                		carbs: req.body.carbs,
	                		fat: req.body.fat,
	                		protein: req.body.protein,
	                		salt: req.body.salt,
	                		sugar: req.body.sugar,
					username: req.session.userId
				});
				client.close();
				//sending confirmation message by rendering empty ejs template with messages
				var message = ["Success!", req.body.name.toLowerCase()+" has been added to the database."];
				res.render('confirmation.ejs', {messages: message});
			});
		}
	});
	
	//search page
	app.get('/searchfood', function(req,res){
		res.render("searchfood.html");
	});
	
	//executed when the search form is submitted
	app.get('/search-result', function(req,res){
		//connecting to database 
		var MongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost';
		MongoClient.connect(url, function (err, client){
			if(err) throw err;
			var db = client.db('calorieBuddy');
			//searching database for the entered keyword
			//searches for items that contain the entered word, not just ones that match 
			//search is not case sensitive
			db.collection('food').find({name:{$regex:req.query.keyword, $options:'i'}}).toArray((findErr, results) => {
				if (findErr) throw findErr;
				else{
					//checking is no items have been found 
					if (results.length==0){
						//sending confirmation message by rendering empty ejs template with array of strings
						var message = ["Failure", "No items that match the search "+req.query.keyword+" were found.", "New food items can be added on the add food page."];
						res.render('confirmation.ejs', {messages: message});
					}
					else{
						//if items have been found, rendering results
						res.render('search-result.ejs', {availablefood: results});
					}
					client.close();
				}
			});
		});
	});
	
	//update page 
	app.get('/updatefood', redirectLogin, function(req, res){
		res.render("updatefood.html");
	});

	//executed when update form is submitted		
	app.get('/update-result', function(req,res){
		//connecting to database
		var MongoClient = require('mongodb').MongoClient;
                var url = 'mongodb://localhost';
                MongoClient.connect(url, function (err, client){
                        if(err) throw err;
                        var db = client.db('calorieBuddy');
                        //searching database for the entered keyword and the users session ID
                        //searches for items that contain the entered word, not just ones that match
                        //search is not case sensitive
                        db.collection('food').find({name:{$regex:req.query.keyword, $options:'i'}, username:req.session.userId}).toArray((findErr, results) => {
                                if (findErr) throw findErr;
                                else{
					//checking if no items have been found
                                        if (results.length==0){
                                                //sending error message by rendering empty ejs template with array of strings
                                                var message = ["Failure", "No items that match the search "+req.query.keyword+" were found.", "New food items can be added on the add food page."];
						res.render('confirmation.ejs', {messages: message});
                                        }
                                        else{
                                                //if items have been found, rendering results
                                                res.render('update-result.ejs', {availablefood: results});
                                        }
                                        client.close();
                                }
                        });
                });
        });

	//executed when update form is submitted by clicking 'Update' or 'Delete'
	//route collects if of the food item that is being updated/deleted
	app.post('/food-updated/:_id', function(req, res){
		//connecting to database 
		var MongoClient = require('mongodb').MongoClient;
                var url = 'mongodb://localhost';
                MongoClient.connect(url, function (err, client){
                        if(err) throw err;
                        var db = client.db('calorieBuddy');

			//requiring ObjectID to update/delete using the items id
                        var ObjectID = require('mongodb').ObjectID;

			//checks if update was clicked 
			if(req.body.submit == "Update"){
				//setting values to update to
				var updateTo = { $set: {"name": req.body.name.toLowerCase(), 
					"typicalValues": req.body.typicalValues, 
					"unitTypicalValues": req.body.unitTypicalValues, 
					"calories": req.body.calories, 
					"carbs": req.body.carbs, 
					"fat": req.body.fat, 
					"protein": req.body.protein, 
					"salt": req.body.salt, 
					"sugar": req.body.sugar}};

				//updating item with matching id to new values  
				db.collection('food').updateOne({"_id": ObjectID(req.params._id)}, updateTo, function(err, result){
					if (err) throw err; 
					else{
						//sending confirmation message by redirecting to update confirmation page
						res.redirect('../update-confirmation');
					}
				});
			}
			//checks if delete was clicked 
			if(req.body.submit == "Delete"){
				//deleting item with matching id
				db.collection('food').deleteOne({"_id": ObjectID(req.params._id)});
				//sending confirmation message by redirecting to delete confirmation page 
				res.redirect('../delete-confirmation');
			}
			client.close();
		});
	});

	//update confirmation page 
	app.get('/update-confirmation', function(req, res){
		res.render('update-confirmation.html');
	});

	//delete confirmation page
	app.get('/delete-confirmation', function(req, res){
		res.render('delete-confirmation.html');
	});

	//list page
	app.get('/listfood', function(req, res){
		//connecting to database 
		var MongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost';
		MongoClient.connect(url, function (err, client) {
			if (err) throw err;
			var db = client.db('calorieBuddy');
			//searching database for all books 
			db.collection('food').find().sort({"name": 1}).toArray((findErr, results) =>{
				if (findErr) throw findErr;
				else
					//rendering results using ejs template
					res.render('listfood.ejs', {availablefood:results});
				client.close();
			});
		});
	});

	//API
	//Can be easily access from the navigation bar on the app
	app.get('/api', function (req,res) {      
		var MongoClient = require('mongodb').MongoClient;      
		var url = 'mongodb://localhost';      
		MongoClient.connect(url, function (err, client) {      
			if (err) throw err      
			var db = client.db('calorieBuddy');
			db.collection('food').find().toArray((findErr, results) => {  
				if (findErr) throw findErr;       
				else
					res.json(results);   
				client.close();
			}); 
		}); 
	});
}
