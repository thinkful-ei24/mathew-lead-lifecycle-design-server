'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const { PRODUCTION_DATABASE_URL } = require('../config');

//Change this variable to the database you want to seed
const database_to_seed = PRODUCTION_DATABASE_URL;

const Lead = require('../models/leads');
const scheduledEventsSchema = require('../models/scheduled-events');
const User = require('../models/user');

const { leads } = require('../db/data');
const { scheduledEvents } = require('../db/data');
const { users } = require('../db/data');

mongoose.connect(database_to_seed, { useNewUrlParser: true})
  .then( () => mongoose.connection.db.dropDatabase())
  .then( () => {
    return Promise.all([
      User.insertMany(users),
      User.createIndexes(),
      Lead.insertMany(leads),
      // scheduledEventsSchema.insertMany(scheduledEvents),
      // scheduledEventsSchema.createIndexes(),
      
    ]);
  })
  .then( returnVals => {
    console.info( `Inserted ${returnVals[0].length} Users`);
    console.info( `Inserted ${returnVals[2].length} Leads`);
    // console.info( `Inserted ${returnVals[3].length} Scheduled Events`);
  })
  .then( () => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });