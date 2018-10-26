'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

passport.use(localStrategy);
passport.use(jwtStrategy);

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const leadsRouter = require('./routes/leads');
const scheduledEventsRouter = require('./routes/scheduled-events');

const { dbConnect } = require('./db/db-mongoose');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// app.options('*', cors());
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


// Parse request body
app.use(express.json());

// Mount routers
app.use('/api/users', usersRouter);
app.use('/api/login', authRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/scheduledevents', scheduledEventsRouter);


// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
