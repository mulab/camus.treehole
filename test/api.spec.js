/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var should = require('should');
var app = require('../app');
var request = require('supertest');

describe('Test API status', function() {
  it('should return ok GET /api/v1/status', function(done) {
    request(app)
      .get('/api/v1/status')
      .expect(200)
      .expect('OK', done);
  });
});
