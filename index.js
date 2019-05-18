
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./models/user');
const Task = require('./models/task');
const reload = require('reload');
const moment = require('moment');

app.use(express.static('public'))

//body parser time!
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//setting handlebars as view engine
var handlebars  = require('express-handlebars').create({defaultLayout: 'main'})
app.engine('handlebars', handlebars.engine);
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
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
	if(req.session.isValidated){
    var layoutToRender = req.session.layout;
    var finder = User.find({ _id: req.session.userId});
    finder.exec(function (err, user) {
      if(err){
         res.render('dashboard',{error:err,layout:layoutToRender})
      } else {
        var format = "MMMM Do, YYYY";
        var date = moment(user[0].joinDate, format);
        user[0].formattedJoinDate = date.format(format)
        console.log(user[0].formattedJoinDate)
        res.render('dashboard',{user:user[0],layout:layoutToRender})
      } 
    });    
	}else {
		res.render('home',{error:'Must Login to see Dashboard.',layout:layoutToRender})
	}
})

app.get('/',function(req,res) {
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
  var user_id = req.session.userId;
  var finder = Task.find({ owner: user_id});
  finder.exec(function (err, docs) {
    if(err){
      res.render('home',{error:err,layout:layoutToRender})
    }else {
      // docs.forEach(function(doc){
      //   doc = 
      // })
      res.render('home',{tasks:docs,layout:layoutToRender})
    }
  })
})

app.post('/login', function(req, res, next){
    var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';

    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {        
        var err = 'Wrong email or password.';
        res.render('home',{error:err,layout:layoutToRender})
      } else {
        req.session.layout = 'loggedIn';
        req.session.userId = user._id;
        req.session.user = user;
        req.session.isValidated = true;
        return res.redirect('/dashboard');
      }
    });
})

app.get('/logout', function (req, res, next) {
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
  if (req.session) {
    // delete session object
    req.session.isValidated = false;
    req.session.layout = 'loggedOut';
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
    var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }
    User.create(userData, function (error, user) {
      if (error) {
        var err = error.errmsg
        console.table(error)
        if(err.indexOf('email') !=-1 && err.indexOf('duplicate')!=-1){
          err = 'Email has been taken.'
        }else if (err.indexOf('username') !=-1 && err.indexOf('duplicate')!=-1){
          err = 'Username has been taken.'
        }
        res.render('home',{error:err,layout:layoutToRender})
      } else {
      	console.log(req.session)
      	console.log(user)
        req.session.userId = user.id;
        req.session.isValidated = true;
        return res.redirect('/dashboard');
      }
    });    
})

app.get('/deletetask/:id',function(req,res,next){
  var task_id = req.params.id
  var query = { _id: task_id };
  var info = {'success':false,err:''}
  var status = 502;
  Task.deleteOne(query, function (err, result) {
    if (err) {
        console.log("error query");
        info.err = err;
      } else {
        console.log(result);
        info.success = true;
        status=200;
    }
    res.status(status).json(info)
});
})

app.post('/newtask',function(req,res,next) {
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
  var taskData = {
    name: req.body.name,
    owner:req.session.userId,
    dueDate: (typeof req.body.dueDate == 'undefined' ? '' : req.body.dueDate),
    description:(typeof req.body.description == 'undefined' ? '' : req.body.description)  ,
    createdDate: new Date().toLocaleString(),
  }
  Task.create(taskData,function(error,task) {
    console.log(task)
    if(error) {
      var err = error.errmsg;
      console.log(err)
      res.render('dashboard',{error:err,layout:layoutToRender})
    } else {
      res.render('dashboard',{success:true,user:req.session.user,layout:layoutToRender})
    }
  })
})

app.get('/tasks',function(req,res,next) {
  var user_id = req.query.id;
  if(user_id!==''){
    var finder = Task.find({ owner: user_id});
    finder.exec(function (err, docs) {
      if(err){
         res.status(404).json({error:err})
      } else {
         var task_info = {
           'completed_tasks':docs.filter(function(item){
                              return item.complete;
                            }).length,
            'todo_tasks':docs.filter(function(item){
                              return !item.complete;
                            }).length,
            'total_tasks':docs.length,
            'tasks':docs                       
         }
         res.status(200).json(task_info)
      } 
    })
   }else {
    var err = {'error_msg':'NO_ID_DEFINED'}
    res.status(405).json({error:err})
  }

})


app.get('/about',function(req,res,next) {
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
  res.render('about',{blob:'TEXT',layout:layoutToRender})
})
app.get('/docs',function(req,res,next) {
  var layoutToRender = (!req.session.isValidated)?'loggedOut':'loggedIn';
  res.render('docs',{blob:'TEXT',layout:layoutToRender})
})

reload(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('node app running on port: ' + PORT);

//http://localhost:5000/

//to start mongo db, run mongod in cmd then mongo for shell