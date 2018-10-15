'use strict';

const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  homePhoneNumber: { type: Number },
  mobilePhoneNumber: { type: Number, required: true },
  emailAddress: { type: String, required: true },
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