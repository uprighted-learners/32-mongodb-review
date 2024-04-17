// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// create express app
const app = express();

// implement middleware
app.use(express.json());
app.use(cors());

// declare a PORT
const PORT = process.env.PORT || 8080;

// GET - /api/health - check if API is alive or not
app.get("/api/health", async (req, res) => {
    try {
        res.send("Server is running");
    } catch (error) {
        console.log(error);
    }
});

// spin up the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});