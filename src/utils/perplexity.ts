export const generateNarrative = async (apiKey: string, conditions: any[], output: any) => {
  try {
    // Validate API key format
    if (!apiKey.startsWith('sk-or-')) {
      throw new Error('Invalid API key format. OpenRouter API keys must start with "sk-or-"');
    }

    const prompt = `Given these URL parameters and conditions: ${JSON.stringify(conditions)}, 
    and this output classification: ${JSON.stringify(output)}, 
    write a brief, formal explanation of how a user arrived at a webpage. 
    Focus on explaining the referral source, parameters present, and what they indicate about the visit type (paid/organic) and platform.
    Keep it concise and professional.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'URL Analyzer',
        'Origin': window.location.origin,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'You are a web analytics expert. Be precise and professional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating narrative:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
    }
    
    throw error; // Re-throw the error to be handled by the component
  }
};