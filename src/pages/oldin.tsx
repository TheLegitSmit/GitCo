import { useState, FormEvent } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  async function sendMessage(e: FormEvent) {
    e.preventDefault();

    setMessages([...messages, { role: 'user', content: input }]);

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);

    setInput('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <header className="text-4xl font-bold mb-4">My Chitty Chatty Bot 🤖</header>
      <p className="mb-4 text-center">This is an extremely simple, work-in-progress chatbot. Type your message and press send to interact with it.</p>
      <p className="mb-6 text-center">No transcripts are saved from the chat. Note that I want to, but I just don't know how yet lol. So no worries about privacy.</p>
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md w-full max-w-md">
        <div className="mb-4 w-full">
          {messages.map((message, index) => (
            <p key={index} className={`mb-2 ${message.role === 'assistant' ? 'text-blue-500' : 'text-green-500'}`}>
              <strong>{message.role}:</strong> {message.content}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex w-full">
          <input value={input} onChange={e => setInput(e.target.value)} className="flex-grow mr-2 p-2 border rounded" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Send</button>
        </form>
      </div>
    </div>
  );
}