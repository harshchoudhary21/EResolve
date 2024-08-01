const User = require('../models/User');
const Society = require('../models/Society');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const housingModel = require('../models/housingModel');


//Register a new user
// Corrected registerUser function based on the User model

//Register a new user
const registerUser = async (req, res) => {
  try {
    const {email, name, password, role, phonenumber, societyId,houseNumber } = req.body;
    // Check if role is resident and societyId is not provided
    if (role === 'resident' && !societyId) {
      return res.status(400).json({ message: 'Society ID is required for resident role' });
    }
    if(!houseNumber ){
      return res.status(400).json({ message: 'House Number is required' });
    }
    //Check if the house number is present in the society
    const houseExists = await housingModel.findOne({ houseNumber, societyId });
    if (!houseExists) {
      return res.status(400).json({ message: 'House number does not exist in the society' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const isSecretary = role === 'secretary';

    
    const user = new User({ ...req.body, password: hashedPassword,isSecretary, phonenumber }); // Removed explicit email assignment
    await user.save();

    await housingModel.updateOne({ houseNumber, societyId }, { $set: { userId: user._id } });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

//Login a user
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(400).json({ message: 'Error logging in' });
    }
}

//Profile of a user
const userProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching user' });
    }
}

// Update user profile with restricted updates
const updateUserProfile = async (req, res) => {
    try {
        // Extract name and email from request body, ignoring other fields
        const { name, email } = req.body;

        // Update only name and email fields
        await User.findByIdAndUpdate(req.userId, { name, email });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user' });
    }
}

//Update user password
const updateUserPassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(req.userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    }   
    catch (error) {
        res.status(400).json({ message: 'Error updating password' });
    }
}

//Delete user
const deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.userId);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting user' });
    }
}
const registerComplain = async (req, res) => {
    try {
      const { complaintType, title, description, houseNumber } = req.body;
      const user = await User.findById(req.userId).exec();
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      } else if (user.isSecretary) {
        return res.status(401).json({ message: 'Only residents can register complaints' });
      } else {
        // Check if complaintType is house_related and houseNumber is not provided
        if (complaintType === 'house_related' && !houseNumber) {
          return res.status(400).json({ message: 'House number is required for house related complaints' });
        }
  
        // Create a new complaint
        const complaintData = { title, description, userId: user._id, societyId: user.societyId, complaintType };
        if (houseNumber) complaintData.houseNumber = houseNumber; // Add houseNumber if provided

        if (req.file) { // Assuming image is sent as 'file' in a multipart/form-data request
          complaintData.image = req.file.buffer;
          complaintData.imageContentType = req.file.mimetype;
        }
        const complaint = new Complaint(complaintData);
        await complaint.save();
  
        // Find the secretary of the user's society
        const secretary = await User.findOne({ role: 'secretary', societyId: user.societyId });
  
        // Create a new notification for the secretary
        const notification = new Notification({
          type: 'complaint_registration',
          userId: secretary._id,
          societyId: user.societyId,
          message: `New complaint of type ${complaintType} registered by ${user.name} with title: ${title} and description: ${description}`
        });
        await notification.save();
  
        res.json({ message: 'Complaint registered successfully' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error registering complaint', error: error.message });
    }
  };
  
// View all complaints by a user
const viewUserComplaints = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      const complaints = await Complaint.find({ userId: user._id });
      res.json(complaints);
    } catch (error) {
      res.status(400).json({ message: 'Error viewing complaints' });
    }
  };


  // Receive notifications by secretary
  const receiveNotifications = async (req, res) => {
    try {
      const secretaryId = req.userId;
      const secretary = await User.findById(secretaryId);
      const societyId = secretary.societyId;
  
      const notifications = await Notification.find({ type: 'complaint_update', societyId: societyId });
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: 'Error receiving notifications' });
    }
  };

  const sendMessageToSecretaryForHouseChange = async (req, res) => {
    try {
      const { message } = req.body; // User's message for house change
      const userId = req.userId; // Assuming req.userId is the ID of the logged-in user
  
      // Find the user and their society ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Ensure the user is a resident, not a secretary
      if (user.role === 'secretary') {
        return res.status(403).json({ message: 'Secretaries cannot request house changes' });
      }
  
      const societyId = user.societyId;
  
      // Find the secretary of the society
      const secretary = await User.findOne({ role: 'secretary', societyId: societyId });
      if (!secretary) {
        return res.status(404).json({ message: 'Secretary not found for the society' });
      }
  
      // Create a new notification for the secretary with the message
      const notification = new Notification({
        type: 'house_change_request',
        userId: secretary._id, // Notification for the secretary
        societyId: societyId,
        message: `House change request from ${user.name}: ${message}`
      });
  
      await notification.save();
  
      res.status(200).json({ message: 'Your request has been sent to the secretary' });
    } catch (error) {
      res.status(400).json({ message: 'Error sending message', error: error.message });
    }
  };


module.exports = {
    registerUser,
    loginUser,
    userProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUser,
    registerComplain,
    viewUserComplaints,
    receiveNotifications,
    sendMessageToSecretaryForHouseChange
}
