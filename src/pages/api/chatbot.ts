import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: [
      { role: 'system', content: 'You are a helpful assistant. You keep all responses to once concise sentence' },
      { role: 'user', content: message },
    ],
  });

  res.status(200).json({ message: response.choices[0].message.content });
}