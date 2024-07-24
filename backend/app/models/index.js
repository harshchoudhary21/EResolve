// models/index.js

const mongoose = require('mongoose');

// Import all models
const User = require('./User');
const Society = require('./Society');
const Complaint = require('./Complaint');
const Notification = require('./Notification');

// Export all models
module.exports = {
  User,
  Society,
  Complaint,
 

  Notification
};