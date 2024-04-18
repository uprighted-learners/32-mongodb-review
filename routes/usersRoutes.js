const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersControllers');

// POST - /api/register - register a new user
router.post('/register', usersController.registerNewUser);

// POST - /api/login - login a user
router.post('/login', usersController.loginUser);

module.exports = router;