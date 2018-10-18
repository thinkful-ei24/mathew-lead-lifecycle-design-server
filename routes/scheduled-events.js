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
  //const { searchTerm } = req.query;
  const userId = req.user._id;
  let filter = { userId };

  //TODO Figure out how to search for PhoneNumber
  // if (searchTerm && typeof(searchTerm) === 'string') {
  //   const re = new RegExp(searchTerm, 'i');
  //   filter.$or = [
  //     { 'firstName': re }, 
  //     { 'lastName': re },
  //     // { 'homePhoneNumber': Number(re) },
  //     // { 'mobilePhoneNumber': re },
  //     { 'emailAddress': re },
  //   ];
  // }

  // if (folderId) {
  //   filter.folderId = folderId;
  // }

  // if (tagId) {
  //   filter.tags = tagId;
  // }

  ScheduledEvent.find(filter)
    //.populate('tags')
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

  ScheduledEvent.findOne({_id: id, userId})
    // .populate('tags')
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
    leadId, 
    eventType, 
    dateAndTime,
    notes,
    leadResponded
  } = req.body;
  const userId = req.user._id;
  console.log(req.body)

  /***** Never trust users - validate input *****/
  const requiredFields = ['leadId'];
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

  const newEvent = { 
    userId, 
    leadId, 
    eventType, 
    dateAndTime,
    notes,
    leadResponded
  };
  
  //VALIDATE TODO: dateAndTime, EventType, time, leadId, 
  // if (!validator.isEmail(newLead.emailAddress)) {
  //   const err = new Error('Invalid email address');
  //   err.status = 400;
  //   return next(err);
  // } else if (homePhoneNumber) {
  //   console.log('home xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', homePhoneNumber)
  //   if (!validatePhone(homePhoneNumber)) {
  //     const err = new Error('Invalid home phone number');
  //     err.status = 400;
  //     return next(err);
  //   }
  // } else if (mobilePhoneNumber) {
  //   console.log('mobile oooooooooooooooooooooooooooooo', mobilePhoneNumber)
  //   if (!validatePhone(mobilePhoneNumber)) {
  //     const err = new Error('Invalid mobile phone number');
  //     err.status = 400;
  //     return next(err);
  //   }
  // }
  let event; 

  ScheduledEvent.create(newEvent)
    .then(e => {event = e;})
    .then(e => Lead.findOne({_id: leadId}))
    .then(lead => {
      console.log(lead)
      lead.scheduledEvents.push(event);
      return lead.save();
    })
    .then(result => {
      res.location(`${req.originalUrl}/${event.id}`).status(201).json(event);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Scheduled Event already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;