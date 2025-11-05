const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const resetPasswordController = require('../controllers/resetPasswordController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', resetPasswordController.resetPassword);
router.get('/verify', authMiddleware, authController.verify);

module.exports = router;
