'use strict';

var db = require('../config/db').db();

module.exports = function (app) {
  app.use('/users', require('./users'));
  app.use('/holes', require('./holes'));
  app.use('/channels', require('./channels'));
  app.use('/images', require('./images'));

  app.use('/status', function (req, res, next) {
    db.collection('holes', {strict: true}, function (err, collection) {
      if (err) {
        err.status = 500;
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  // development error handler
  // will print stack trace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      console.error(err);
      res.format({
        json: function () {
          res.status(err.status).send({ message: err.message || '' });
        },
        html: function () {
          res.render('error', {
            message: err.message,
            error: err
          });
        }
      });
    });
  }

  // production error handler
  // no stack trace leaked to user
  if (app.get('env') === 'production') {
    app.use(function (err, req, res, next) {
      if (!err.status) {
        // internal error
        console.error(err);
        res.format({
          json: function () {
            res.sendStatus(500);
          },
          html: function () {

          }
        });
      } else {
        // normal error
        res.format({
          json: function () {
            res.status(err.status).send({ message: err.message || '' });
          },
          html: function () {
            res.render('error', {
              message: err.message,
              error: {}
            });
          }
        });
      }
    });
  }
};
