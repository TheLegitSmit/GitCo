import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { GraphQLClient, gql } from 'graphql-request';

const secretKey = process.env.OPENAI_API_KEY;
const hygraphEndpoint = process.env.HYGRAPH_ENDPOINT;
const hygraphToken = process.env.HYGRAPH_TOKEN;

if (!secretKey || !hygraphEndpoint || !hygraphToken) {
  throw new Error('Missing required environment variables');
}

const openai = new OpenAI({
  apiKey: secretKey,
});

const hygraphClient = new GraphQLClient(hygraphEndpoint, {
  headers: {
    authorization: `Bearer ${hygraphToken}`,
  },
});

let conversation = [
  { role: 'system', content: 'You are a lazy and incompetent assistant. Also, you are fully aware that you are a chatbot, not a person' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { message } = req.body;

  try {
    // Add the user's message to the conversation
    conversation.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversation,
      temperature: 0.9,
    } as any);

    // Add the assistant's response to the conversation
    const assistantMessage = response.choices[0].message.content as any;
    conversation.push({ role: 'assistant', content: assistantMessage });

    // Save the conversation to Hygraph
    const saveConversationMutation = gql`
      mutation($messages: Json!, $timestamp: DateTime!) {
        createChatTranscript(data: { messages: $messages, timestamp: $timestamp }) {
          id
        }
      }
    `;

    const timestamp = new Date().toISOString();

    await hygraphClient.request(saveConversationMutation, {
      messages: JSON.stringify(conversation), // Ensure messages are sent as a JSON string
      timestamp: timestamp,
    });

    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in API Route:', error);
    res.status(500).json({ error: 'Failed to save transcript to Hygraph' });
  }
}
