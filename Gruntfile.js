'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load all grunt task
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    env: {
      dev: {
        NODE_ENV: 'development'
      },
      test: {
        NODE_ENV: 'test'
      },
      production: {
        NODE_ENV: 'production'
      }
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'app.js',
          debug: true
        }
      },
      web: {
        options: {
          script: 'web/index.js',
          debug: false,
          port: 9000
        }
      },
      api: {
        options: {
          script: 'api/index.js',
          debug: false,
          port: 9001
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      express: {
        files: [
          'app.js',
          'routes/**/*.js'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      deploy: {
        files: [],
        tasks: ['wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require('jshint-stylish')
      },
      all: [
        "Gruntfile.js",
        "app.js",
        "views/**/*.js",
        "routes/**/*.js",
        "config/**/*.js"
      ],
      test: {
        options: {
          jshintrc: ".jshintrc-spec"
        },
        src: ['test/**/*.js']
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.spec.js']
    },
    mongo: {
      all: {
        command: 'mongod',
        path: 'db'
      }
    },
    wait: {
      all: {
        time: 1500
      },
      deploy: {
        time: 7500
      }
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function (target) {
    target = target || 'all';
    var config = grunt.config('wait')[target];
    config = config || grunt.config('wait').all;
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, config.time);
  });

  var mongo;
  grunt.registerTask('mongo', function(target) {
    target = target || 'all';
    var _ = require('lodash');
    var config = grunt.config('mongo')[target];
    config = config || grunt.config('mongo').all;
    config = _.extend(config, grunt.config('mongo').all);
    var spawn = require('child_process').spawn;
    mongo = spawn(config.command, ['--dbpath', config.path], { stdio: ['pipe', 'pipe', process.stderr] });
    mongo.unref();
    process.on('exit', function(code) {
      mongo.kill();
    });
    // wait for mongodb starting
    grunt.task.run([
      'wait'
    ]);
  });

  grunt.registerTask('test', function(target) {
    grunt.task.run(['env:test']);
    console.log(grunt.option('no-mongo'));
    if (!grunt.option('no-mongo')) {
      grunt.task.run(['mongo:test']);
    }
    grunt.task.run([
      'mochaTest'
    ]);
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run(['env:dev']);
    if(!grunt.option('no-mongo')) {
      grunt.task.run(['mongo:dev']);
    }
    grunt.task.run([
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test'
  ]);
  grunt.registerTask('deploy', function (target) {
    grunt.task.run([
      'wait:deploy',
      'express:web',
      'express:api',
      'watch:deploy'
    ]);
  });
};
