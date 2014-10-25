'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load all grunt task
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'app.js',
          debug: true
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
        "routes/**/*.js"
      ]
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.spec.js']
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('test', function(target) {
    grunt.task.run([
      'mochaTest'
    ]);
  });

  grunt.registerTask('serve', function (target) {
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
};
