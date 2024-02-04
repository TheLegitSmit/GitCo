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
    <div className="p-4">
      <div className="mb-4">
        {messages.map((message, index) => (
          <p key={index} className={`mb-2 ${message.role === 'assistant' ? 'text-blue-500' : 'text-green-500'}`}>
            <strong>{message.role}:</strong> {message.content}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-grow mr-2 p-2 border rounded" />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Send</button>
      </form>
    </div>
  );
}