
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./models/user');

app.use(express.static('public'))

//body parser time!
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//setting handlebars as view engine
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/webapp');
//production url: mongodb://admin:hzJi745JF9yEV9e@ds125486.mlab.com:25486/heroku_sn1g0n8w
mongoose.connect('mongodb://admin:hzJi745JF9yEV9e@ds125486.mlab.com:25486/heroku_sn1g0n8w');

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


//routes
app.get('/dashboard',function(req,res) {
	if(req.session.isValidated){
		res.render('dashboard')
	}else {
		res.render('home',{error:'Must Login to see Dashboard.'})
	}
})

app.get('/',function(req,res) {
	res.render('home')
})

app.post('/login', function(req, res, next){
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = 'Wrong email or password.';
        res.render('home',{error:err})
      } else {
        req.session.userId = user._id;
        req.session.isValidated = true;
        return res.redirect('/dashboard');
      }
    });
})

app.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.isValidated = false;
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.post('/register',function(req,res,next) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }
    User.create(userData, function (error, user) {
      if (error) {
      	var err = error.errmsg
        if(err.indexOf('email') !=-1 && err.indexOf('duplicate')!=-1){
          err = 'Email has been taken.'
        }else if (err.indexOf('username') !=-1 && err.indexOf('duplicate')!=-1){
          err = 'Username has been taken.'
        }
        res.render('home',{error:err})
      } else {
      	console.log(req.session)
      	console.log(user)
        req.session.userId = user.id;
        req.session.isValidated = true;
        return res.redirect('/dashboard');
      }
    });    
})


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('node app running on port: ' + PORT);

//http://localhost:5000/

//to start mongo db, run mongod in cmd then mongo for shell