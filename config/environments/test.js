/**
 * Created by guangchen on 10/28/14.
 */
'use strict';

var path = require('path');

module.exports = {
  root: path.resolve(__dirname, '../../'),
  db_host: 'localhost',
  db_port: 27017,
  db_name: 'test',
  db_option: {auto_reconnect: true},
  debug: false,
  seed: false
};
