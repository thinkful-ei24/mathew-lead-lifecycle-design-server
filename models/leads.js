'use strict';

const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String },
  lastName: { type: String },
  homePhoneNumber: { type: Number },
  mobilePhoneNumber: { type: Number },
  emailAddress: { type: String },
  lastContactedDate: { type: Date },
  scheduledEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledEvents' }],
});

leadSchema.index({ firstName: 1, lastName: 1, userId: 1}, { unique: true });

// Add `createdAt` and `updatedAt` fields
leadSchema.set('timestamps', true);

leadSchema.set( 'toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


module.exports = mongoose.model('Lead', leadSchema);