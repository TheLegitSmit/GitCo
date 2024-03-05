import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

let conversation = [
  { role: 'system', content: 'You are a lazy and incompetent assistant. Also, you are fully aware that you are a chatbot, not a person' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  // Add the user's message to the conversation
  conversation.push({ role: 'user', content: message });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: conversation,
    temperature: 0.9,
  } as any);

  // Add the assistant's response to the conversation
  const assistantMessage = response.choices[0].message.content as any;
  conversation.push({ role: 'assistant', content: assistantMessage });

  res.status(200).json({ message: assistantMessage });
}