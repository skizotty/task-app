//todo - fix the gulpfile thing, it only starts when typing gulp into the  console... not sure why lol 

const express = require('express');
const app = express();

//body parser time!
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//setting handlebars as view engine
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//routes

app.get('/', function (req, res) {
    res.render('home');
});


app.post('/login', function(request, response){
    console.log(request.body);
    var info = request.body
    //lookup username and password here
    if(info.username == 'hello' && info.password == 'world'){
    	response.render('loggedin')
    }else {
    	
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('node app running on port: ' + PORT);

//http://localhost:5000/