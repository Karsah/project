const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const infoRout = require('./routes/infoRouter');
const tourRout = require('./routes/tourRouter');
const feedbackRout = require('./routes/feedbackRouter');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tourism', tourRout);
app.use('/feedback', feedbackRout);
app.use('/information', infoRout);
app.use('/', function(req, res) {
  res.render('frontend/index', { title: 'home page' });
});

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.render('error.ejs')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error',{
    title:'Not Found!'
  });
});
module.exports = app;
