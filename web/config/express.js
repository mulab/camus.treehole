/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var nconf = require('nconf');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

module.exports = function (app, callback) {
  var swig = require('swig');
  // view engine setup
  app.engine('html', swig.renderFile);
  console.log(nconf.get('root'));
  app.set('views', path.join(nconf.get('root'), 'views'));
  app.set('view engine', 'html');
  swig.setDefaults({
    loader: swig.loaders.fs(path.join(nconf.get('root'), 'views')),
    cache: nconf.get('debug') ? false: 'memory',
    locals: {
      currentTime: function () {
        return (new Date()).toString();
      }
    }
  });
  app.set('view cache', !nconf.get('debug'));

  // sass engine setup
  var sassMiddleware = require('node-sass-middleware');
  app.use(sassMiddleware({
    src: path.join(nconf.get('root'), 'public'),
    dest: path.join(nconf.get('root'), 'public'),
    debug: nconf.get('debug')
  }));

  // uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(expressSession({
    secret: 'mULab3.14159',
    resave: false,
    saveUninitialized: true
  }));
  app.use(express.static(path.join(nconf.get('root'), 'public')));
};
