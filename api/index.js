'use strict';

var server = require('./api.js');

server.listen(process.env.PORT || 9000, function () {
  console.log('API server listening');
});
