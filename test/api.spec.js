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

describe('POST /api/v1/treehole', function() {
  it('should create tree-hole and returns id', function(done) {
    request(app)
      .post('/api/v1/treehole')
      .send({
        "content": "test"
      })
      .expect(200, done);
  });
});

describe('GET /api/v1/treehole', function() {
  it('should get tree-hole lists', function(done) {
    request(app)
      .get('/api/v1/treehole')
      .expect(200, done);
  });
});

describe('GET /api/v1/treehole/:id', function() {
  it('should get a tree-hole', function(done) {
    request(app)
      .get('/api/v1/treehole/1')
      .expect(200, done);
  });
});
