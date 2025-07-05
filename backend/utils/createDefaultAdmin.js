const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const config = require('../config');

const createDefaultAdmin = async () => {
  try {
    // Check if default admin exists
    const defaultAdmin = await Admin.findOne({ email: config.DEFAULT_ADMIN_EMAIL });
    
    if (!defaultAdmin) {
      // Create default admin
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
        role: 'super_admin',
        registrationDate: new Date()
      });
      
      await newAdmin.save();
      console.log('Default admin created successfully!');
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = createDefaultAdmin; 