/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./environments/development');

module.exports = function(app) {
  var swig = require('swig');
  // view engine setup
  app.engine('html', swig.renderFile);
  console.log(config.root);
  app.set('views', path.join(config.root, 'views'));
  app.set('view engine', 'html');

  // uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(config.root, 'public')));
};
