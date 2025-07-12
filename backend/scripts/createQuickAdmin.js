const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const config = require('../config');

const createQuickAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: config.DEFAULT_ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      // Approve the existing admin
      existingAdmin.isApproved = true;
      existingAdmin.isDefaultAdmin = true;
      existingAdmin.role = 'super_admin';
      await existingAdmin.save();
      console.log('Admin approved and set as super_admin successfully!');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(config.DEFAULT_ADMIN_PASSWORD, 10);
      
      const newAdmin = new Admin({
        name: 'Super Admin',
        email: config.DEFAULT_ADMIN_EMAIL,
        phone: '1234567890',
        address: 'Admin Address',
        aadharNumber: '123456789012',
        aadharImage: 'default-aadhar.jpg',
        password: hashedPassword,
        isApproved: true,
        isDefaultAdmin: true,
        role: 'super_admin',
        registrationDate: new Date()
      });

      await newAdmin.save();
      console.log('Admin created successfully!');
      console.log(`Email: ${config.DEFAULT_ADMIN_EMAIL}`);
      console.log(`Password: ${config.DEFAULT_ADMIN_PASSWORD}`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

createQuickAdmin(); 