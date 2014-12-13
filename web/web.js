'use strict';

var express = require('express');
var db = require('../config/db').db();
var app = express();

var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

module.exports = server;
