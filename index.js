// import dependencies
const express = require('express');
const cors = require('cors');

// create express app
const app = express();

// implement middleware
app.use(express.json());
app.use(cors());

// declare a PORT
const PORT = process.env.PORT || 8080;

// connect to MongoDB
require("./config/database");

// GET - /api/health - check if API is alive or not
app.get("/api/health", async (req, res) => {
    try {
        res.send("Server is running");
    } catch (error) {
        console.log(error);
    }
});

// import routes
app.use('/api', require('./routes/usersRoutes')); // users routes
app.use('/api', require('./routes/blogPostsRoutes')); // blog posts routes

// spin up the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});