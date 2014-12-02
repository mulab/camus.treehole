'use strict';

require('./config/init')();
var server = require('./web');

server.listen(process.env.PORT || 8000, function () {
  console.log('Web server listening');
});
