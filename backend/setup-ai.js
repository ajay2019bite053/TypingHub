#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 TypingHub AI Setup');
console.log('=====================\n');

console.log('This script will help you configure the OpenRouter API key securely.');
console.log('The API key will be stored in your config file and will NOT be exposed to users.\n');

rl.question('Enter your OpenRouter API key (sk-or-v1-...): ', (apiKey) => {
  if (!apiKey.trim()) {
    console.log('❌ API key is required. Please run the script again with a valid key.');
    rl.close();
    return;
  }

  if (!apiKey.startsWith('sk-or-v1-')) {
    console.log('❌ Invalid OpenRouter API key format. Key should start with "sk-or-v1-"');
    rl.close();
    return;
  }

  // Update .env file
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Please create a .env file first.');
    rl.close();
    return;
  }

  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if OPENROUTER_API_KEY already exists
  if (envContent.includes('OPENROUTER_API_KEY=')) {
    // Update existing key
    envContent = envContent.replace(
      /OPENROUTER_API_KEY=.*/,
      `OPENROUTER_API_KEY=${apiKey}`
    );
  } else {
    // Add new key at the end
    envContent += `\n# OpenRouter API Key\nOPENROUTER_API_KEY=${apiKey}\n`;
  }

  // Write updated .env file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ OpenRouter API key has been configured successfully!');
  console.log('📁 The key has been saved to your .env file');
  console.log('🔒 The key is secure and will not be exposed to users or committed to git');
  console.log('\n🚀 You can now restart your server to use the AI features');
  console.log('\n💡 To restart:');
  console.log('   npm run dev (for development)');
  console.log('   npm start (for production)');

  rl.close();
});

rl.on('close', () => {
  process.exit(0);
}); 