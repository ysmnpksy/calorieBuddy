var express = require ('express') //inclusion of express module 
var bodyParser = require ('body-parser') //inclusion of bodyParser module 
var session = require ('express-session') //inclusion of express module 
var validator = require ('express-validator') //inclusion off express-validator module  

const expressSanitizer = require ('express-sanitizer'); //inclusion of express-sanitizer module 

const app = express ()
const port = 8000

//added for session management  
app.use(session({         
	secret: 'somerandomstuffs',         
	resave: false,         
	saveUninitialized: false,         
	cookie: {                 
		expires: 600000   
	} 
}));

app.use(express.static('views')); //added for style.css
app.use(expressSanitizer()); //added for sanitisation 

var MongoClient = require('mongodb').MongoClient; //inclusion of mongo module
var url = "mongodb://localhost/calorieBuddy";
MongoClient.connect(url, function(err, db) { //connecting to mongo calorieBuddy databse 
	if (err) throw err;
	console.log("Database created!");
	db.close();
});                                                                                                                                        

//body parser middleware 
app.use(bodyParser.urlencoded({extended: true}))

require('./routes/main')(app);
//view engine setup
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//setting port 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

