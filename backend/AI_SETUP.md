# AI Setup Guide for TypingHub

## Overview
This guide explains how to set up the AI text generation feature using OpenRouter API securely.

## Security Features
- ✅ API key is stored securely in backend config file
- ✅ API key is NEVER exposed to frontend users
- ✅ All AI requests go through your backend server
- ✅ No need to modify frontend code for production
- ✅ No .env file required

## Setup Steps

### 1. Get OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up/Login to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

### 2. Configure API Key (Automatic)
Run the setup script:
```bash
cd backend
npm run setup-ai
```

Enter your OpenRouter API key when prompted.

### 3. Configure API Key (Manual)
If you prefer to set it manually:

1. Open `backend/config.js` file
2. Find the line with `OPENROUTER_API_KEY`
3. Replace the key value with your actual API key:
```javascript
OPENROUTER_API_KEY: 'sk-or-v1-your-api-key-here'
```

### 4. Restart Server
```bash
# Development
npm run dev

# Production
npm start
```

## How It Works

### Frontend (Secure)
- Users enter search topics in the CreateTest page
- Frontend sends requests to your backend API
- No API keys are exposed to users

### Backend (Secure)
- Backend receives requests from frontend
- Backend uses your OpenRouter API key to generate text
- Multiple AI models are tried for reliability
- Generated text is returned to frontend

## API Endpoints

### Generate Text
```
POST /api/ai/generate-text
```

**Request Body:**
```json
{
  "searchText": "modi ji",
  "textLength": "150-200"
}
```

**Response:**
```json
{
  "text": "Generated passage text...",
  "wordCount": 175,
  "model": "openai/gpt-3.5-turbo"
}
```

## Features

### Multiple AI Models
The system tries multiple models for reliability:
- OpenAI GPT-3.5 Turbo
- Anthropic Claude-2
- Google PaLM-2
- Meta Llama-2

### Word Count Control
- Configurable word ranges (100-450 words)
- Automatic text trimming to meet requirements
- Quality validation

### Error Handling
- Graceful fallback between models
- User-friendly error messages
- Detailed logging for debugging

## Troubleshooting

### API Key Issues
- Ensure key starts with `sk-or-v1-`
- Check if key has sufficient credits
- Verify key is active in OpenRouter dashboard

### Generation Failures
- Try different topics
- Check server logs for detailed errors
- Ensure internet connectivity

### Production Deployment
- Update `OPENROUTER_API_KEY` in your config.js file
- No frontend changes needed
- API key remains secure on server

## Security Notes
- ✅ API key never leaves the server
- ✅ No client-side API calls to OpenRouter
- ✅ All requests go through your backend
- ✅ API key stored in config file
- ✅ No .env file required 