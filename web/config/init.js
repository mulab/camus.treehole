'use strict';

var nconf = require('nconf');
var fs = require('fs');
var path = require('path');

module.exports = function () {
  var env = process.env.NODE_ENV || 'development';
  var root = path.resolve(__dirname, '../');
  var envConfigPath = path.join(root, 'config', 'environments', env + '.json');
  var defaultConfigPath = path.join(root, 'config', 'defaults.json');
  nconf.overrides({ root: root });
  nconf.use('environments', { type: 'file', file: envConfigPath });
  nconf.use('defaults', { type: 'file', file: defaultConfigPath });
};
