const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Import loginUser
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser); // Add this line for login

module.exports = router;