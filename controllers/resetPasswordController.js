const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) return res.status(400).json({ message: 'All fields are required' });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
