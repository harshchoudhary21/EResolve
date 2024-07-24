// middleware/requireSecretaryRole.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireSecretaryRole = async (req, res, next) => {
    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        // Extract the token from the Authorization header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        const userId = decoded.userId;
        console.log(`Looking for user ID: ${userId}`);

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is a secretary
        if (user.role !== 'secretary') {
            return res.status(403).json({ message: 'Access restricted to secretaries only' });
        }
        req.userId = userId;

        // User is a secretary, proceed to the next middleware
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else {
            console.error('Error in requireSecretaryRole middleware:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

};

module.exports = requireSecretaryRole;