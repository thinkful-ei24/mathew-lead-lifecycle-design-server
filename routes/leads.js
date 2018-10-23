'use strict';

const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const Lead = require('../models/leads');
const ScheduledEvent = require('../models/scheduled-events');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use('/', jwtAuth);

function validatePhone(phoneNumber) {
  let newPhoneNumber = '';
  if (!phoneNumber) {
    return;
  }

  if (phoneNumber[0] === '1') {
    newPhoneNumber = phoneNumber.slice(1);
  } else {
    newPhoneNumber = phoneNumber;
  }

  if( newPhoneNumber.length !== 10 ) {
    return false;
  }

  return true;
}

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const userId = req.user._id;
  let filter = { userId };

  //TODO Figure out how to search for PhoneNumber
  if (searchTerm && typeof(searchTerm) === 'string') {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [
      { 'firstName': re }, 
      { 'lastName': re },
      // { 'homePhoneNumber': Number(re) },
      // { 'mobilePhoneNumber': re },
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
    .populate('scheduledEvents')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Lead.findOne({_id: id, userId})
    //To find a Lead by scheduledEvents._id (like if you had a list of scheduled events)
    // Lead.findOne({'scheduledEvents._id': mongoose.Types.ObjectId('5bca2e36e059f63edc89856c')})
    //Might also be helpful:  https://stackoverflow.com/questions/15686374/how-to-retrieve-parent-document-based-on-subdocument-values-in-mongoose
    .populate('scheduledEvents')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
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
    leadNotes
  } = req.body;
  const userId = req.user._id;
  

  /***** Never trust users - validate input *****/
  const requiredFields = ['firstName', 'lastName', 'mobilePhoneNumber', 'emailAddress'];
  for (let field of requiredFields) {
    if (!(field in req.body)) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: field
      });
      // return next(err);
    }
  }

  //validation needed: 
  //  DONE homePhoneNumber: required to be 10 digits, no 1 in front (trim that off), no whitespace
  //  DONE mobilePhoneNumber: see above
  //  DONE emailAddress: Must have @ sign, must end with valid tld
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
  
  if (!validator.isEmail(newLead.emailAddress)) {
    const err = new Error('Invalid email address');
    err.status = 400;
    return next(err);
  }
  if (homePhoneNumber) {
    console.log('home xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', homePhoneNumber)
    if (!validatePhone(homePhoneNumber)) {
      const err = new Error('Invalid home phone number');
      err.status = 400;
      return next(err);
    }
  }
  if (mobilePhoneNumber) {
    console.log('mobile oooooooooooooooooooooooooooooo', mobilePhoneNumber)
    if (!validatePhone(mobilePhoneNumber)) {
      const err = new Error('Invalid mobile phone number');
      err.status = 400;
      return next(err);
    }
  }

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