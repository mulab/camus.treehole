'use strict';

var child_process = require('child_process');

var web = child_process.exec('node web/index.js');

var api = child_process.exec('node api/index.js');

web.stdout.pipe(process.stdout);
api.stdout.pipe(process.stdout);
web.stderr.pipe(process.stderr);
api.stderr.pipe(process.stderr);
