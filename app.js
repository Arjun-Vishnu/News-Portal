var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/articles');
var usersRouter = require('./routes/users');
let Article = require('./models/article');

var app = express();
mongoose.connect('mongodb://localhost/blog');
let db = mongoose.connection;

//Check for db errors
db.on('error', function(err){
  console.log(err);
});

//Check connection
db.once('open', function(){
  console.log("Connected to mongodb");
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
 
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
      if (err) {
          console.log(err);
      }
      else {
          res.render('index', {
              title: 'Articles',
              articles: articles
          });
      } 
  });
});
// app.get('/', async function(req, res){
//   const [ results, itemCount ] = await Promise.all([
//       Article.find({}).limit(req.query.limit).skip(req.skip),
//       Article.count({})
//   ]);
  
  // const pageCount = Math.ceil(itemCount / req.query.limit);
 
  // res.render('index', {
  //     title: 'Articles',
  //     articles: results,
  //     pageCount,
  //     itemCount,
  //     pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  // });
// });

app.use('/articles', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
