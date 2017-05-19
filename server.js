"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//Middleware
var app = express();
var port = process.env.PORT || 5000;
app.use(express.static('resources'));

app.set('views','./src/views');
app.set('view engine','ejs');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Use Routes
var alignRouter = require('./src/routes/align.js')();
app.use('/align', alignRouter);

app.listen(port, function(err) {
	console.log('running server on port ' + port);
});

app.get('/', function(req, res) {
	res.render('index');
});

