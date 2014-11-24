/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var path = require('path');

module.exports = {
  root: path.resolve(__dirname, '../../'),
  db_host: 'localhost',
  db_port: 27017,
  db_name: 'treeholes',
  db_option: {auto_reconnect: true},
  debug: true,
  seed: true
};
