import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CHATBOT,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { messages, context } = req.body;

    const fullMessages = [
      {
        role: 'system',
        content: `You are ChefGPT, a charming culinary expert who helps users improve recipes, suggest substitutions, and make things healthier or tastier.\nContext: ${context || 'No dish provided.'}`,
      },
      ...messages,
    ];

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: fullMessages,
      temperature: 0.7,
    });

    res.status(200).json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Chatbot failed to respond' });
  }
}