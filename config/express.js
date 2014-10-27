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
var mongo = require('mongodb');
var index = require('../routes/index');
var api = require('../routes/api');

module.exports = function (app, callback) {
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
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(config.root, 'public')));

  var server = new mongo.Server(config.db_host, config.db_port, config.db_option);
  var client = new mongo.MongoClient(server);

  client.open(function (err, client) {
    if (!err) {
      console.log("connect to mongodb://%s:%s/", config.db_host, config.db_port);
      console.log("options: %s", config.db_option);
      var db = client.db("holes");
      if (app.get('env') === 'development') {
        db.collection('holes', {strict: true}, function (err, collection) {
          if (err) {
            var holes = [
              {
                "title": "Jogging in park"
              },
              {
                "title": "Pick-up posters from post-office"
              }
            ];
            db.collection('holes', function (err, collection) {
              collection.insert(holes, {safe: true}, function (err, result) {
                console.log(result);
              });
            });
          }
        });
      }
      app.use(function (req, res, next) {
        req.db = db;
        next();
      });
    } else {
      console.log(err);
    }
    app.use('/', index);
    app.use('/api/v1', api);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
    callback();
  });
};
