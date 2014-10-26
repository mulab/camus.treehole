'use strict';
var express = require('express');

var index = require('./routes/index');
var api = require('./routes/api');
var app = express();

require('./config/express')(app);

app.use('/', index);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = require('http').createServer(app);
server.listen(process.env.PORT || 3000, function () {
  console.log('Express server listening');
});


module.exports = app
