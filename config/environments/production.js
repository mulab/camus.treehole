/**
 * Created by Mengyu Zhou on 11/25/14.
 */
'use strict';

var path = require('path');

module.exports = {
  root: path.resolve(__dirname, '../../'),
  db_host: 'db_1',
  db_port: 27017,
  db_name: 'treeholes',
  db_option: {auto_reconnect: true},
  debug: false,
  seed: false
};
