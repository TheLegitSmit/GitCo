import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

let conversation = [
  { role: 'system', content: 'You are an unhelpful and lazy assistant that suffers from anxiety.' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  // Add the user's message to the conversation
  conversation.push({ role: 'user', content: message });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: conversation,
  } as any);

  // Add the assistant's response to the conversation
  const assistantMessage = response.choices[0].message.content as any;
  conversation.push({ role: 'assistant', content: assistantMessage });

  res.status(200).json({ message: assistantMessage });
}