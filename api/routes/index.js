'use strict';

var db = require('../config/db').db();

module.exports = function (app) {
  app.use('/holes', require('./holes'));
  app.use('/channels', require('./channels'));

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
  // will print stacktrace
  //if (app.get('env') === 'development') {
  //  app.use(function (err, req, res, next) {
  //    console.error(err);
  //    if (req.path.lastIndexOf('/api', 0) === 0) {
  //      res.sendStatus(err.status || 500);
  //    } else {
  //      res.status(err.status || 500);
  //      res.render('error', {
  //        message: err.message,
  //        error: err
  //      });
  //    }
  //  });
  //}

  // production error handler
  // no stacktraces leaked to user
  // TODO
//  app.use(function (err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: {}
//    });
//  });
};
