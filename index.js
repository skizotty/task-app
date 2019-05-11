
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./models/user');
const Task = require('./models/task');
const reload = require('reload');
app.locals.info = 'req.session;'


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
	if(req.session.isValidated){
    var finder = User.find({ _id: req.session.userId});
    finder.exec(function (err, user) {
      if(err){
         res.render('dashboard',{error:err})
      } else {
         res.render('dashboard',{user:user[0]})
      } 
    });    
	}else {
		res.render('home',{error:'Must Login to see Dashboard.'})
	}
})

app.get('/',function(req,res) {
  var user_id = req.session.userId;
  var finder = Task.find({ owner: user_id});
  finder.exec(function (err, docs) {
    if(err){
      res.render('home',{error:err})
    }else {
      res.render('home',{tasks:docs})
    }
  })
})

app.post('/login', function(req, res, next){
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {        
        var err = 'Wrong email or password.';
        res.render('home',{error:err})
      } else {
        req.session.userId = user._id;
        req.session.isValidated = true;
        app.locals.info = req.session;
        return res.redirect('/dashboard');
      }
    });
})

app.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.isValidated = false;
    app.locals.info = req.session;
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
        console.table(error)
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
        app.locals.info = req.session;
        return res.redirect('/dashboard');
      }
    });    
})

app.post('/newtask',function(req,res,next) {
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
      res.render('dashboard',{error:err})
    } else {
      res.render('dashboard',{success:true})
    }
  })
})

app.get('/tasks',function(req,res,next) {
  console.log(req.query.id)
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
  res.render('about',{blob:'TEXT'})
})
app.get('/docs',function(req,res,next) {
  res.render('docs',{blob:'TEXT'})
})

reload(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('node app running on port: ' + PORT);

//http://localhost:5000/

//to start mongo db, run mongod in cmd then mongo for shell