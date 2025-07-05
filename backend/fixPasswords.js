require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      console.log(`\nProcessing user: ${user.email}`);
      
      // Check if password is already properly hashed
      if (user.password && user.password.startsWith('$2b$')) {
        console.log('Password already properly hashed, skipping...');
        continue;
      }
      
      // If password is not properly hashed, we need to set a default password
      // or ask user to reset their password
      const defaultPassword = 'password123'; // Temporary default password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      
      user.password = hashedPassword;
      await user.save();
      
      console.log(`Updated password for ${user.email}`);
      console.log(`New password: ${defaultPassword}`);
    }
    
    console.log('\nPassword fix completed!');
    console.log('All users now have properly hashed passwords.');
    console.log('Default password for all users: password123');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPasswords(); 