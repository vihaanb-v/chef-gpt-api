import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CHATBOT
});

app.post('/api/chat', async (req, res) => {
  const { messages, context } = req.body;

  try {
    const fullMessages = [
      {
        role: 'system',
        content: `You are ChefGPT, a charming culinary expert who helps users improve recipes, suggest substitutions, and make things healthier or tastier.\nContext: ${context || 'No dish provided.'}`
      },
      ...messages
    ];

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: fullMessages,
      temperature: 0.7
    });

    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Chatbot failed to respond' });
  }
});

// Required for Vercel serverless
export default app;
