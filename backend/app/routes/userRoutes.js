const express = require('express');
const router = express.Router();
const Authentication  = require('../middlewares/auth');

const { registerUser, loginUser, userProfile, updateUserProfile, updateUserPassword, deleteUser, registerComplain, viewUserComplaints, receiveNotifications, sendMessageToSecretaryForHouseChange, refreshAccessToken } = require('../controllers/userControllers');

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Refresh accessToken
router.post('/refresh-token', refreshAccessToken);

// Get user profile (protected route)
router.get('/profile',Authentication,  userProfile);

// Update user profile (protected route)
router.patch('/updateprofile',Authentication,  updateUserProfile);

// Update user password (protected route)
router.patch('/password',Authentication,  updateUserPassword);

// Delete user (protected route)
router.delete('/delete',Authentication, deleteUser);

// Register a new complaint (protected route)
router.post('/complain',Authentication,  registerComplain);

// View a complaint (protected route)
router.get('/allcomplains',Authentication,  viewUserComplaints);

// Receive notifications (protected route)
router.get('/notifications',Authentication,  receiveNotifications);

// Send a message to the secretary for a house change (protected route)
router.post('/housechange',Authentication,  sendMessageToSecretaryForHouseChange);



module.exports = router;