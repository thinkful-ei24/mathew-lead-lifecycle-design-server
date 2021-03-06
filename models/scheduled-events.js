'use strict';

const mongoose = require('mongoose');
// Valid EventTypes: 
// * followUpCall
// * followUpEmail
// * automatedEmail
// * automatedText
// * visitToBusiness
// * freeTrialDay

//Valid leadResponded: true, false

const scheduledEventsSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  eventType: { type: String, required: true },
  dateAndTime: { type: Date, required: true },
  notes: { type: String },
  leadResponded: { type: Boolean }
});

scheduledEventsSchema.index({ userId: 1, leadId: 1, eventType: 1, dateAndTime: 1});

// Add `createdAt` and `updatedAt` fields
scheduledEventsSchema.set('timestamps', true);

scheduledEventsSchema.set( 'toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


// module.exports = mongoose.model('ScheduledEvent', scheduledEventsSchema);
module.exports = scheduledEventsSchema;