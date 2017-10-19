const express = require('express');
var methodOverride = require('method-override');

// Component for User module - Phong
var path = require('path');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app = express()
	  express_session = require('express-session'),
	  bodyParser = require('body-parser'),
	  port = process.env.PORT || 8080,
	  mongoose = require('mongoose'),
	  ejs = require('ejs'),
      product = require('./app/Models/product.js'),
      session = require('express-session'),
      cookieParser = require('cookie-parser');





mongoose.Promise = global.Promise;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'iloveyoubaobao', // session secret
    resave: false,
    saveUninitialized: true
}));
app.use(methodOverride('_method'))

var routes = require('./app/routes/route.js'); //importing route
var users = require('./app/routes/users.js');
routes(app);

// View engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Passport init - Phong
app.use(passport.initialize());
app.use(passport.session());

// Express Validator - Phong
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash - Phong
app.use(flash());

// Global Vars - Phong
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/users', users);

app.get('/mydemo', (req, res)=>
{
	res.send('Hello World!');
});

app.listen(port,()=>
{
	console.log('listened port'+ port);
});

