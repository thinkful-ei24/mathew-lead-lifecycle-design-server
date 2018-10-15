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

  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', req.user)

  /***** Never trust users - validate input *****/
  const requiredFields = ['firstName', 'lastName', 'mobilePhoneNumber', 'emailAddress'];
  for (let field of requiredFields) {
    if (!(field in req.body)) {
      const err = new Error(`Missing ${field} in request body`);
      err.status = 400;
      return next(err);
    }
  }

  const newLead = { 
    firstName, 
    lastName, 
    homePhoneNumber, 
    mobilePhoneNumber,
    emailAddress,
    lastContactedDate,
    scheduledEvents,
    userId  };

    console.log(newLead)

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