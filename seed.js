require('dotenv').config();
const mongoose = require('mongoose');
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// Establish a connection to MongoDB
mongoose.connect(process.env.MONGO_URI, connectOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Define the BlogPost model directly in the seed script for simplicity
const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    body: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Array of sample blog posts
const samplePosts = [
    { title: "Mongoose Magic", author: "John Doe", body: "An exploration into the powers of Mongoose for MongoDB interaction." },
    { title: "Node.js Streams", author: "Jane Smith", body: "Understanding the complexities and power of streams in Node.js." },
    { title: "Advanced JavaScript", author: "Emily Johnson", body: "Diving deep into the features that make JavaScript a unique and powerful language." }
];

// Insert sample blog posts into the database
BlogPost.insertMany(samplePosts)
    .then(() => {
        console.log("Blog posts successfully added!");
        mongoose.connection.close(); // Close the connection after successful insertion
    })
    .catch((error) => {
        console.error("Error inserting sample blog posts:", error);
        mongoose.connection.close(); // Close the connection on error
    });
