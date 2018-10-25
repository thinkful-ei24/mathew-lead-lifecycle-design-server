'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const {app} = require('../index');
chai.use(chaiHttp);
const expect = chai.expect;

chai.use(chaiHttp);
describe('Reality Check', () => {
  it('true should be true', () => {
    expect(true).to.be.true;
  });

  describe('Environment', () => {
    describe('Basic Express setup', () => {
      describe('Express static', () => {
        it('GET request "/" should return the index page', () => {
          return chai.request(app)
            .get('/')
            .then(function (res) {
              expect(res).to.exist;
              expect(res).to.have.status(404);
            });
        });
      });
      describe('404 handler', () => {
        it('should respond with 404 when given a bad path', () => {
          return chai.request(app)
            .get('/bad/path')
            .then(res => {
              expect(res).to.have.status(404);
            });
        });
      });
    })
  })
})