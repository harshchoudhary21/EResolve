// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['resident', 'secretary'],
    required: true
  },
  phonenumber: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: false // Not required initially
  },
  isSecretary: {
    type: Boolean,
    default: false
  },
  houseNumber: {
    type: String,
    required: true // Make house number required
  }
});

module.exports = mongoose.model('User', userSchema);