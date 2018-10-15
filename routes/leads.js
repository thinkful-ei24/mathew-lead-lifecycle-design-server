'use strict';

const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Lead = require('../models/leads');
const ScheduledEvent = require('../models/scheduled-events');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use('/', jwtAuth);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const userId = req.user._id;

  let filter = { userId };

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [
      { 'firstName': re }, 
      { 'lastName': re },
      { 'homePhoneNumber': re },
      { 'mobilePhoneNumber': re },
      { 'emailAddress': re },
    ];
  }

  // if (folderId) {
  //   filter.folderId = folderId;
  // }

  // if (tagId) {
  //   filter.tags = tagId;
  // }

  Lead.find(filter)
    //.populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    homePhoneNumber, 
    mobilePhoneNumber,
    emailAddress,
    lastContactedDate,
    scheduledEvents,
  } = req.body;
  const userId = req.user._id;

  /***** Never trust users - validate input *****/
  const requiredFields = ['firstName', 'lastName', 'mobilePhoneNumber', 'emailAddress'];
  for (let field of requiredFields) {
    if (!(field in req.body)) {
      const err = new Error(`Missing ${field} in request body`);
      err.status = 400;
      return next(err);
    }
  }

  //validation needed: 
  //  homePhoneNumber: required to be 10 digits, no 1 in front (trim that off), no whitespace
  //  mobilePhoneNumber: see above
  //  emailAddress: Must have @ sign, must end with valid tld
  //  lastContactedDate: Must be a date
  //  scheduledEvents: Not sure yet

  const newLead = { 
    firstName, 
    lastName, 
    homePhoneNumber, 
    mobilePhoneNumber,
    emailAddress,
    lastContactedDate,
    scheduledEvents,
    userId  };

  // if (newNote.folderId === '') {
  //   delete newNote.folderId;
  // }

  Lead.create(newLead)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Lead name already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;