// OpenRouter API Configuration
export const AI_CONFIG = {
  // OpenRouter API key
  OPENROUTER_API_KEY: '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',
  
  // API Endpoints
  BASE_URL: 'https://openrouter.ai/api/v1',
  
  // Model Configuration - Free & High-Quality Models
  MODELS: [
    'mistral/mistral-7b-instruct', // Primary model
    'meta-llama/llama-3-8b-instruct', // Fallback 1
    'anthropic/claude-3-haiku' // Fallback 2
  ],
  MODEL: 'mistral/mistral-7b-instruct', // Default model
  
  // Generation Parameters
  DEFAULT_PARAMS: {
    max_length: 200,
    temperature: 0.8,
    do_sample: true,
    top_p: 0.9,
    repetition_penalty: 1.1
  },
  
  // Topic-specific prompts for government exams
  TOPIC_PROMPTS: {
    general: {
      short: "The importance of education in modern society",
      medium: "Education is the cornerstone of human development and societal progress",
      long: "Education represents the most powerful tool for human development and societal transformation"
    },
    ssc: {
      short: "The Staff Selection Commission conducts various examinations",
      medium: "The Staff Selection Commission (SSC) plays a crucial role in India's government recruitment process",
      long: "The Staff Selection Commission (SSC) stands as a cornerstone of India's government recruitment system"
    },
    banking: {
      short: "Banking sector reforms have transformed India's financial landscape",
      medium: "India's banking sector has undergone remarkable transformation through comprehensive reforms",
      long: "India's banking sector has experienced unprecedented transformation through strategic reforms"
    },
    railway: {
      short: "Indian Railways modernization has improved connectivity across the nation",
      medium: "Indian Railways has been undergoing significant modernization to enhance passenger services",
      long: "Indian Railways represents one of the largest railway networks in the world"
    },
    police: {
      short: "Police reforms are essential for maintaining law and order",
      medium: "Modern policing requires comprehensive reforms to address contemporary challenges",
      long: "The Indian police force plays a vital role in maintaining internal security"
    },
    court: {
      short: "Court assistants support the judicial system efficiently",
      medium: "The role of court assistants is crucial in the administration of justice",
      long: "Court assistants play an integral role in the functioning of the judicial system"
    },
    technology: {
      short: "Technology has revolutionized various sectors in India",
      medium: "Digital transformation has become essential for government services",
      long: "The integration of technology in governance has improved service delivery"
    },
    'current-affairs': {
      short: "Current affairs play a crucial role in competitive examinations",
      medium: "Staying updated with current affairs is essential for government job aspirants",
      long: "Current affairs knowledge is fundamental for success in competitive examinations"
    }
  }
};

// Helper functions
export const getMaxLength = (length: string) => {
  switch (length) {
    case '100-150': return 150;
    case '150-200': return 200;
    case '200-250': return 250;
    case '250-300': return 300;
    case '300-350': return 350;
    case '350-400': return 400;
    case '400-450': return 450;
    default: return 200;
  }
};

export const cleanGeneratedText = (text: string, topic: string, length: string) => {
  // Remove the original prompt from the generated text
  const prompt = AI_CONFIG.TOPIC_PROMPTS[topic as keyof typeof AI_CONFIG.TOPIC_PROMPTS]?.[length as keyof typeof AI_CONFIG.TOPIC_PROMPTS.general] || 
         "The importance of continuous learning and skill development";
  
  let cleanedText = text.replace(prompt, '').trim();
  
  // Ensure proper sentence structure
  if (!cleanedText.endsWith('.') && !cleanedText.endsWith('!') && !cleanedText.endsWith('?')) {
    cleanedText += '.';
  }
  
  // Limit length based on selection
  const maxWords = length === 'short' ? 100 : length === 'medium' ? 200 : 300;
  const words = cleanedText.split(' ');
  if (words.length > maxWords) {
    cleanedText = words.slice(0, maxWords).join(' ') + '.';
  }
  
  return cleanedText;
}; 