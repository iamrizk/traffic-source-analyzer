export const generateNarrative = async (apiKey: string, conditions: any[], output: any) => {
  try {
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
        'HTTP-Referer': window.location.href,
        'X-Title': 'URL Analyzer'
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

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating narrative:', error);
    return null;
  }
};