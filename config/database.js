const mongoose = require('mongoose');
require('dotenv').config();

// Options for MongoDB connection, recommended for MongoDB Atlas
const options = {
    useNewUrlParser: true, // Use the new MongoDB Node.js driver URL string parser
    useUnifiedTopology: true, // Use the new connection management engine
    retryWrites: true, // Automatically retry write operations upon transient network errors
    w: 'majority' // Write concern set to "majority" for data consistency
};

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, options)
    .catch(error => console.error('MongoDB connection error:', error)); // Catch any initial connection errors

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error)); // Listen to error events
db.once('open', () => console.log('Connected to MongoDB Atlas'));

module.exports = db;
