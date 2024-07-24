const Society = require('../models/Society');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Register a new society
const registerSociety = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }
    const secretaryId = req.userId;
    console.log(secretaryId);

    
    
    if (!secretaryId) {
      return res.status(400).json({ message: 'Secretary ID is missing' });
    }
    const existingSecretary = await User.findOne({ _id: secretaryId, societyId: { $exists: true, $ne: null } });
    if (existingSecretary) {
      return res.status(400).json({ message: 'Secretary already has a society assigned' });
    }

    const existingSociety = await Society.findOne({ $or: [{ name: name }] });
    if (existingSociety) {
      return res.status(400).json({ message: 'Society with the same name already exists' });
    }
  
    const society = new Society({ name, address, secretaryId });
    await society.save();
    await User.findByIdAndUpdate(secretaryId, { societyId: society._id });
    res.status(201).json({ message: 'Society registered successfully' });
    
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: 'Error registering society', error: error.message });
  }
};

// Update a complaint
// Update a complaint
const updateComplaint = async (req, res) => {
    try {
   
        const { id } = req.params;
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        if (!complaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        // Send notification to user
        const notification = new Notification({
          type: 'complaint_update',
          userId: complaint.userId,
          societyId: complaint.societyId,
          complaintId: complaint._id,
          message: `Your Complaint with title  ${complaint.title} has been updated to ${status}`,
        });
        await notification.save();
        res.status(200).json({ message: 'Complaint updated successfully' });
      }
    catch (error) {
      res.status(400).json({ message: 'Error updating complaint' }); 
    }
  };
  
  // Receive complaints by secretary
  const receiveComplaints = async (req, res) => {
    try {
     
        const secretaryId = req.userId;
        const secretary = await User.findById(secretaryId);
        const societyId = secretary.societyId;
        const complaints = await Complaint.find({ societyId });
        res.json(complaints);
      }
     catch (error) {
      res.status(400).json({ message: 'Error receiving complaints' });
    }
  };

  //View registered societies

  const viewSocieties = async (req, res) => {
    try {
      const societies = await Society.find();
      res.json(societies);
    } catch (error) {
      res.status(400).json({ message: 'Error viewing societies' });
    }
  }

  // View users of the registered society for a secretary
const viewSocietyUsers = async (req, res) => {
  try {
    const secretaryId = req.userId; // Assuming req.userId is the ID of the secretary making the request
    const secretary = await User.findById(secretaryId);

    if (!secretary || !secretary.societyId) {
      return res.status(403).json({ message: 'Secretary not associated with any society' });
    }

    const users = await User.find({ societyId: secretary.societyId });
    res.json(users);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: 'Error viewing society users', error: error.message });
  }
};

//Filter complaints by status
const filterComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const complaints = await Complaint.find({ status });
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ message: 'Error filtering complaints' });
  }
};

const filterComplaintsByType = async (req, res) => {
  try {
    const { complaintType } = req.query; // Get complaintType from query parameters
    const complaints = await Complaint.find({ complaintType }); // Find complaints matching the type
    res.json(complaints); // Send the found complaints as response
  } catch (error) {
    res.status(400).json({ message: 'Error filtering complaints by type', error: error.message });
  }
};

const addHouseNumberandAddress = async (req, res) => {  
  try {
    const { houseNumber, address } = req.body;
    const userId = req.userId;
    //Verify if the secretary has the society assigned and is registered society
    const secretary = await User.findOne({ _id: userId, societyId: { $exists: true, $ne: null } });
    if (!secretary || !secretary.societyId) {
      return res.status(403).json({ message: 'Secretary not associated with any society' });
    }
    const society = await Society.findById(secretary.societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    //Check if the same house number is already registered
    const existingHouse = await Housing.findOne({societyId:secretary.societyId, houseNumber: houseNumber });
    if (existingHouse) {
      return res.status(400).json({ message: 'House number already registered' });
    }
    //Create a new house
    const house = new Housing({ houseNumber, address, societyId: secretary.societyId });
    await house.save();
    res.status(201).json({ message: 'House registered successfully' });
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: 'Error registering house', error: error.message });
  }

}

module.exports = { registerSociety, updateComplaint, receiveComplaints, viewSocieties, viewSocietyUsers, filterComplaints, filterComplaintsByType, addHouseNumberandAddress };

  
  
 