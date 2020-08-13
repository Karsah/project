const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const app = express();

app.use(session({
  secret: "kar",
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//main routes connection
const backendRout = require('./routes/backend/backendRouter');
const homeRout = require('./routes/frontend/homerouter')

//main routes
app.use('/backend',backendRout)
app.use('/',homeRout)



// catch 404 and forward to error handler
app.use(function(req, res) {
  res.render('error.ejs',{
    title:'Error:404'
  })
});

module.exports = app;
