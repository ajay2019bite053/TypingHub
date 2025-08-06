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

  // Update config.js file
  const configPath = path.join(__dirname, 'config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ config.js file not found');
    rl.close();
    return;
  }

  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Replace the API key in config file
  const apiKeyRegex = /OPENROUTER_API_KEY:\s*['"`][^'"`]*['"`]/;
  const newApiKeyLine = `OPENROUTER_API_KEY: '${apiKey}'`;
  
  if (configContent.includes('OPENROUTER_API_KEY:')) {
    // Update existing key
    configContent = configContent.replace(apiKeyRegex, newApiKeyLine);
  } else {
    // Add new key before the closing brace
    configContent = configContent.replace(
      /(\s*};?\s*)$/,
      `  // OpenRouter API Key - Replace with your actual key\n  ${newApiKeyLine}\n$1`
    );
  }

  // Write updated config
  fs.writeFileSync(configPath, configContent);

  console.log('✅ OpenRouter API key has been configured successfully!');
  console.log('📁 The key has been saved to your config.js file');
  console.log('🔒 The key is secure and will not be exposed to users');
  console.log('\n🚀 You can now restart your server to use the AI features');
  console.log('\n💡 To restart:');
  console.log('   npm run dev (for development)');
  console.log('   npm start (for production)');

  rl.close();
});

rl.on('close', () => {
  process.exit(0);
}); 