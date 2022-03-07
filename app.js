let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');


// import BrandRouter from "./api/brand/routes/index";
const BrandRouter = require("./api/brand/routes/index");
const CategoryRouter = require('./api/brand/routes/categoryRoute');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dbCon = "mongodb+srv://masumkhan:169572274@cluster0.wnhig.mongodb.net/Brand?retryWrites=true&w=majority"

mongoose.connect(dbCon)
.then(()=>{console.log("Database connection successfully")})
.catch((err)=>{console.log("Database did not connection", err)}); 


// app.use("/", function(req, res, next){
//   res.status(200).send({msg: "My name is Masum Khan"})
// });

app.use("/brands", BrandRouter);
app.use('/categories', CategoryRouter);



// catch 404 and forward to error handler
app.use('/',function (req, res, next) {
  return res.status(200).send({msg: "Welcome to express app"});
});

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
