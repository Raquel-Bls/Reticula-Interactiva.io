// Load Node modules
var express = require('express');

const ejs = require('ejs');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));

// Se le dice a express que utilice ejs
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    var name = "Ayram Dominycke Ochoa Hernández";
    // Render index page
    res.render('pages/index', {
        // EJS variable and server-side variable
        name:name
    });
});



app.get('/register', function (req, res) {
    res.render('pages/register');
    
});

app.get('/login', function (req, res) {
    res.render('pages/login');
    
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, OPTIONS"
    );
    next();
  });


// Port website will run on
app.listen(8080);