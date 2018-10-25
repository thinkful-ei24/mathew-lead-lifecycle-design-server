'use strict';

const users = [
  {
    '_id': '000000000000000000000001',
    'fullname': 'Test User',
    'username': 'demoaccount', //pass is demopassword
    'password': '$2a$10$7rjKEbzAAjXCoIl45MS5/elePRYrhu.jKDIFr75/E0GVY6oKoekv6'
  },
  {
    '_id': '000000000000000000000002',
    'fullname': 'Bob User',
    'username': 'bob',
    'password': '$2a$10$7PwBfFh41Gjp0RbRqby.sO8z5Jkl9o.tDlP9NjaZjv.YCEkglIMzC'
  }
];

const leads = [
  {
    _id: '111111111111111111111101',
    userId: '000000000000000000000001',
    firstName: 'John',
    lastName: 'Test',
    homePhoneNumber: 8135552345,
    mobilePhoneNumber: 9415552345,
    emailAddress: 'john@testspam.com',
    lastContactedDate: 1540488141019,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111102',
    userId: '000000000000000000000001',
    firstName: 'Bob',
    lastName: 'Test',
    homePhoneNumber: 8134445644,
    mobilePhoneNumber: 9411234567,
    emailAddress: 'bob@testspam.com',
    lastContactedDate: 1540488141012,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111103',
    userId: '000000000000000000000001',
    firstName: 'Jane',
    lastName: 'Smith',
    mobilePhoneNumber: 3234442232,
    emailAddress: 'jane@thisisatest.com',
    lastContactedDate: 1540488140412,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111104',
    userId: '000000000000000000000001',
    firstName: 'Sally',
    lastName: 'Jones',
    mobilePhoneNumber: 3231112232,
    emailAddress: 'sally@ms.com',
    lastContactedDate: 1540487040412,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111105',
    userId: '000000000000000000000001',
    firstName: 'Dale',
    lastName: 'Nunley',
    homePhoneNumber: 8134445644,
    mobilePhoneNumber: 9411234567,
    emailAddress: 'dale@testspam.com',
    lastContactedDate: 1540488141012,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111106',
    userId: '000000000000000000000001',
    firstName: 'Walter',
    lastName: 'White',
    mobilePhoneNumber: 3234442232,
    emailAddress: 'walter@thisisatest.com',
    lastContactedDate: 1540488140412,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111107',
    userId: '000000000000000000000001',
    firstName: 'Mazie',
    lastName: 'Clickner',
    mobilePhoneNumber: 3231112232,
    emailAddress: 'mazie@ms.com',
    lastContactedDate: 1540467040412,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111108',
    userId: '000000000000000000000001',
    firstName: 'Vicky',
    lastName: 'Beagles',
    homePhoneNumber: 8134445644,
    mobilePhoneNumber: 9411234567,
    emailAddress: 'vicky@testspam.com',
    lastContactedDate: 1540368141012,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111109',
    userId: '000000000000000000000001',
    firstName: 'Thelma',
    lastName: 'Krueger',
    mobilePhoneNumber: 3234442232,
    emailAddress: 'thelma@thisisatest.com',
    lastContactedDate: 1540177140412,
    scheduledEvents: []
  },
  {
    _id: '111111111111111111111110',
    userId: '000000000000000000000001',
    firstName: 'Raymond',
    lastName: 'Flippo',
    mobilePhoneNumber: 3231112232,
    emailAddress: 'ray@ms.com',
    lastContactedDate: 1540473020412,
    scheduledEvents: []
  }
];

const scheduledEvents = [];

module.exports = { users, leads, scheduledEvents };