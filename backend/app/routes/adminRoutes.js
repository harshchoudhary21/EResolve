const express = require('express');
const router = express.Router();
const { registerSociety, updateComplaint, receiveComplaints,viewSocieties,viewSocietyUsers, filterComplaintsByType, filterComplaints,addHouseNumberandAddress } = require('../controllers/adminControllers');
const requireSecretaryRole = require('../middlewares/secretaryAuth');

// Register a new society - only accessible by secretaries
router.post('/register-society', requireSecretaryRole, registerSociety);

// Update a complaint - only accessible by secretaries
router.patch('/complaints/:id', requireSecretaryRole, updateComplaint);

// Receive complaints by secretary - only accessible by secretaries
router.get('/complaints', requireSecretaryRole, receiveComplaints);

// View registered societies - only accessible by secretaries
router.get('/societies', requireSecretaryRole, viewSocieties);

// View users of the registered society for a secretary - only accessible by secretaries
router.get('/society-users', requireSecretaryRole, viewSocietyUsers);

//Filter complaints by status
router.get('/complaintsbystatus', requireSecretaryRole, filterComplaints);

//Filter complaints by type
router.get('/complaintsbytype', requireSecretaryRole, filterComplaintsByType);

//Add house number and address
router.patch('/addHouseNumberandAddress', requireSecretaryRole, addHouseNumberandAddress);



module.exports = router;