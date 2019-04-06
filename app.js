var mysql = require('mysql');
var express = require('express')
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',                    
	database : 'fitbit',
	port     : 3308                      
});

connection.connect(function(err){         
  if(!err) {
      console.log("Database is connected");   
  } else {
      console.log("Error while connecting with database"+err);
  }
  });
  module.exports = connection; 

app.use(session({                                           //Express know we'll be using some of its packages
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.post('/auth/login', function(request, response) {                     //handles the POST request
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} 
			else {
				response.send('Incorrect Username and/or Password!');  
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/auth/register', function(request, response) {                     //handles the POST request
	var password = request.body.password;
	var username = request.body.username;
	var first_name = request.body.first_name;
	var last_name = request.body.last_name;
	var email_id = request.body.email_id;
	if (username && password) {
		connection.query('INSERT into user(first_name,last_name,username,email_id,password) VALUES("");', function(error, results, fields) {
			console.log(error,results,fields)
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/main');
			} 
			else {
				response.send('Incorrect Username and/or Password!');  
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
	
});





app.get('/home', function(request, response) {                            //redirected to the home page
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + 'main');
	} 
	else {
		response.send('Please login to view this page!');
	}
	response.end();
});

// app.get('/' , function(request, response){
// 	response.render('main')
// })

// app.get('/login' , (request , response) => {
// 	response.render('login')
// })

// app.get('/register' , (request , response) => {
// 	 response.render('register')
	
// })

app.listen('7000', function(){
  console.log("Server is running!!");
})





