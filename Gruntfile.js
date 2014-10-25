'use strict'

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
          script: 'bin/www',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'express:dev'
    ]);
  });

  grunt.registerTask('default', []);
};
