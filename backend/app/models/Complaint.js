const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  complaintType: {
    type: String,
    enum: ['general', 'house_related'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // New field for storing image data
  image: {
    type: Buffer,
    required: false // Set to true if the image is required
  },
  // Optionally, store the content type of the image (e.g., "image/jpeg")
  imageContentType: {
    type: String,
    required: false
  },
  houseNumber: {
    type: String,
    required: false // Not required for all complaints, only for house_related ones
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);