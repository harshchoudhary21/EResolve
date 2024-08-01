const express = require('express');
const app = express();
const connectDB = require('./app/config/db');
const adminRoutes = require('./app/routes/adminRoutes');
const userRoutes = require('./app/routes/userRoutes');
require("dotenv").config()

connectDB()

app.use(express.json()); // Add this line to enable JSON parsing

app.use('/api/admin', adminRoutes); // Add this line to mount admin routes
app.use('/api/users', userRoutes); // Add this line to mount user routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});