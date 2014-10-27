/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var app = require('../app');
var request = require('supertest');
var id = 1;

describe('Test API', function() {
  before(function (done) {
    setTimeout(function () {
      done();
    }, 1500);
  });

  describe('GET /api/v1/status', function() {
    it('should return ok', function(done) {
      request(app)
        .get('/api/v1/status')
        .expect(200)
        .expect('OK', done);
    });
  });

  describe('POST /api/v1/holes', function() {
    it('should create tree-hole and returns id', function(done) {
      request(app)
        .post('/api/v1/holes')
        .send({
          "title": "Test"
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          res.body.should.have.property('id');
          res.body.should.have.property('title', 'Test');
          id = res.body.id;
        })
        .end(done);
    });
  });

  describe('GET /api/v1/holes', function() {
    it('should get tree-hole lists', function(done) {
      request(app)
        .get('/api/v1/holes')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          res.body.should.with.length(1);
        })
        .end(done);
    });
  });

  describe('GET /api/v1/holes/:id', function() {
    it('should get a tree-hole', function(done) {
      request(app)
        .get('/api/v1/holes/' + id)
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property('title', 'Test');
        })
        .end(done);
    });
  });
});
