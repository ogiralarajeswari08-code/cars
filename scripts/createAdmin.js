const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/car_portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hash = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: adminEmail,
      phone: '1234567890',
      password: hash,
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
