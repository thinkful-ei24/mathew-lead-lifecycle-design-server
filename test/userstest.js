'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
// const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const {app} = require('../index');
const Lead = require('../models/leads');
const User = require('../models/user');

const { users, leads, scheduledEvents } = require('../db/data');
const { TEST_DATABASE_URL } = require('../config');

const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
// const sandbox = sinon.createSandbox();
let token = '';
let user = '';

function basicFailureChai(newUser) {
  return chai.request(app)
    .post('/api/users/')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then(res => {
      expect(res).to.have.status(422);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.all.keys('code', 'reason', 'message', 'location');
    });
}

describe('Lead Lifecyle Design - Users', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true })
      .then(() => Promise.all([
        User.deleteMany(),
        Lead.deleteMany()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Lead.insertMany(leads)
    ])
      .then( ([users]) => {
        user = users[0];
        token = jwt.sign( {user}, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return Promise.all([
      User.deleteMany(),
      Lead.deleteMany()
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /api/users', function () {
    it('should create and return a new user when provided valid data', function () {
      const newUser = { 
        firstName: 'myFirstName',
        lastName: 'myLastName',
        username: 'testuser',
        password: 'password'
      };
      let body;
      return chai.request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .then(function (res) {
          body = res.body;
          //let data = User.findById(body.id)
          console.log(body)
          
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.all.keys('_id', 'username', 'password', '__v');
          return User.findById(body._id);
        })
        .then(data => {
          expect(body._id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
        });
    });

    it('Should reject users with missing username', function() {
      const newUser = { 
        password: 'password', 
        firstName: 'myfirstname',
        lastName: 'mylastname' 
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with a missing password', function() {
      const newUser = { 
        username: 'username', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with non-string username', function () {
      const newUser = { 
        username: 4147376476635, 
        password: 'password', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with non-string password', function () {
      const newUser = { 
        username: 'username', 
        password: 342423424, 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with non-string fullname', function () {
      const newUser = { 
        username: 'username', 
        password: 'password', 
        firstName: 342423424,
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with non-trimmed username', function () {
      const newUser = { 
        username: 'username    ', 
        password: 'password', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with non-trimmed password', function () {
      const newUser = { 
        username: 'username', 
        password: 'password   ', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with empty username', function () {
      const newUser = { 
        username: '', 
        password: 'password', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with password less than eight characters', function () {
      const newUser = { 
        username: 'username', 
        password: 'pas', 
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with password greater than 72 characters', function () {
      const newUser = { 
        username: 'username', 
        password: [...new Array(73)].map( (x,i) => 'a').join(''), // or 'a'.repeat(73)
        firstName: 'myfirstname',
        lastName: 'mylastname'
      };
      return basicFailureChai(newUser);
    });

    it('Should reject users with duplicate username', function () {
      const newUser = { 
        username: 'username', 
        password: 'password',
        firstName: 'myfirstname1',
        lastName: 'mylastname1'
      };
      const newUser2 = { 
        username: 'username', 
        password: 'password2',
        firstName: 'myfirstname2',
        lastName: 'mylastname2'
      };
      return chai.request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .then(res => {
          return chai.request(app)
            .post('/api/users/')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser2)
            .then(res => {
              expect(res).to.have.status(400);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.all.keys('status', 'message');
            });
        })
    });
  });
});