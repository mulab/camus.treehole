'use strict';

var express = require('express');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');

module.exports = function (app, callback) {
  //var config = require('./environments/' + app.get('env'));

  //console.log(config.root);

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
};
