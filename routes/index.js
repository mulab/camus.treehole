'use strict';

module.exports = function (app) {
  app.use('/', require('./page'));
  app.use('/api/v1', require('./api'));
  app.use('/hole', require('./hole'));
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
      console.error(err);
      if (req.path.lastIndexOf('/api', 0) === 0) {
        res.sendStatus(err.status || 500);
      } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    });
  }

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
