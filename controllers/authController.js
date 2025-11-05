const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) return res.status(400).json({ message: 'All fields are required' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;
    const user = await User.create({ firstName, lastName, name, email, phone, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, loginType } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    // Use ternary operator to check role match
    user.role !== loginType ? res.status(403).json({ message: `You are not authorized to login as ${loginType}` }) : (() => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    })();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Send email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}`;
    try {
      await sendEmail(
        email,
        'Password Reset Request',
        `Click the link to reset your password: ${resetLink}`,
        `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with response even if email fails
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verify = async (req, res) => {
  try {
    // If middleware passed, token is valid
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
