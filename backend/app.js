var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var cors = require('cors');

/*
var redis = require('redis')
var client = redis.createClient()
*/

var playersRouter = require('./routes/players');
var turnRouter = require('./routes/turn');

/*
client.on('error', function (err) {
  console.log('Error ' + err);
})
*/
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/players', playersRouter);
app.use('/turn', turnRouter);

module.exports = app;
