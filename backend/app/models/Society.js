// models/Society.js

const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  secretaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
 
});

module.exports = mongoose.model('Society', societySchema);