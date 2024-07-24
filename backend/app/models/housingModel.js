// models/Housing.js

const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true
    },
    address: {
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
    }
});

module.exports = mongoose.model('Housing', housingSchema);