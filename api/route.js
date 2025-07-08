import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CHATBOT,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, context } = body;

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

    return Response.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error('Chatbot error:', err);
    return Response.json({ error: 'Chatbot failed to respond' }, { status: 500 });
  }
}