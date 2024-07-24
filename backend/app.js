const express = require('express');
const app = express();
const db = require('./app/config/db');
const adminRoutes = require('./app/routes/adminRoutes');
const userRoutes = require('./app/routes/userRoutes');

db.connection.once('open', () => {
    console.log('MongoDB connected');
});

db.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

app.use(express.json()); // Add this line to enable JSON parsing

app.use('/api/admin', adminRoutes); // Add this line to mount admin routes
app.use('/api/users', userRoutes); // Add this line to mount user routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});