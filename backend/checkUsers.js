require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('email mobile password');
    console.log('\nAll users in database:');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Mobile: ${user.mobile || 'Not set'}`);
      console.log(`   Has Password: ${!!user.password}`);
      console.log(`   Password Length: ${user.password ? user.password.length : 0}`);
      console.log(`   Password starts with $2b$: ${user.password ? user.password.startsWith('$2b$') : false}`);
      console.log('---');
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers(); 