'use strict';

var _ = require('lodash');
var fork = require('child_process').fork;
var runList = ['web/index.js', 'api/index.js'];

var debugPort = -1;
var execArgv = [];
_.each(process.execArgv, function (entry) {
  var matchResult = entry.match(/--debug-brk=(\d+)/);
  if (matchResult && matchResult[0] === entry) {
    debugPort = parseInt(matchResult[1]);
  } else {
    execArgv.push(entry);
  }
});

_.each(runList, function (entry, i) {
  if (debugPort !== -1) {
    fork(entry, { execArgv: execArgv.concat('--debug-brk=' + (debugPort + i + 1)) });
  } else {
    fork(entry, { execArgv: execArgv });
  }
});
