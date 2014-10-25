/**
 * Created by guangchen on 10/26/14.
 */
"use strict";

var should = require('should');
var app = require('../app');
var request = require('supertest');

describe('Test Index.html', function () {
  it('should respond with html without error', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });
});
