const config = require('../config');

// AI Text Generation Controller
const generateText = async (req, res) => {
  try {
    const { prompt, textLength = '150-200', searchText } = req.body;

    if (!prompt && !searchText) {
      return res.status(400).json({ 
        message: 'Either prompt or searchText is required' 
      });
    }

    const topic = searchText || prompt;
    const { min, max } = getWordRange(textLength);
    
    const aiPrompt = `Write a passage of ${max} words about ${topic} in the style of SSC CGL/CHSL/RRB-NTPC typing exams. Write as a continuous paragraph without titles, headings, or excessive spacing. Focus on government exams, competitive tests, and educational content. Make it suitable for typing practice with proper sentence structure and flow. Passage must be at least ${min} words, but as close to ${max} words as possible.`;

    // OpenRouter API configuration
    const OPENROUTER_API_KEY = config.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service not configured' 
      });
    }

    const models = [
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-haiku',
      'mistralai/mistral-7b-instruct',
      'meta-llama/llama-3-8b-instruct',
      'google/gemma-7b-it',
      'anthropic/claude-2',
      'google/palm-2-chat-bison',
      'meta-llama/llama-2-13b-chat'
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': req.get('origin') || 'https://typinghub.in',
            'X-Title': 'TypingHub'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: aiPrompt }],
            max_tokens: Math.round(max * 1.6),
            temperature: 0.7,
            top_p: 0.9,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        });

        if (!response.ok) {
          console.log(`Model ${model} failed with status: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (!data.choices?.[0]?.message?.content) {
          console.log(`Model ${model} returned no content`);
          continue;
        }

        let generatedText = data.choices[0].message.content.trim();
        const cleaned = cleanParagraphs(generatedText);
        const wordCount = cleaned.split(/\s+/).filter(w => w.length > 0).length;
        
        if (wordCount < min) {
          console.log(`Model ${model} returned text with ${wordCount} words, which is less than ${min} words.`);
          continue;
        }
        
        // Trim to max words if needed
        const trimmed = trimToMaxWords(cleaned, max);
        
        console.log(`Successfully generated text using model: ${model}`);
        return res.status(200).json({ 
          text: trimmed,
          wordCount: trimmed.split(/\s+/).filter(w => w.length > 0).length,
          model: model
        });
        
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue;
      }
    }
    
    // If all models failed
    return res.status(500).json({ 
      message: `Failed to generate a passage of at least ${min} words. Please try again.` 
    });
    
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      message: 'Server error during text generation',
      error: error.message 
    });
  }
};

// Helper functions
const getWordRange = (length) => {
  switch (length) {
    case '100-150': return { min: 100, max: 150 };
    case '150-200': return { min: 150, max: 200 };
    case '200-250': return { min: 200, max: 250 };
    case '250-300': return { min: 250, max: 300 };
    case '300-350': return { min: 300, max: 350 };
    case '350-400': return { min: 350, max: 400 };
    case '400-450': return { min: 400, max: 450 };
    default: return { min: 150, max: 200 };
  }
};

const trimToMaxWords = (text, max) => {
  const words = text.trim().split(/\s+/);
  if (words.length > max) {
    return words.slice(0, max).join(' ') + '.';
  }
  return text.trim();
};

const cleanParagraphs = (text) => {
  return text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
};

module.exports = {
  generateText
}; 