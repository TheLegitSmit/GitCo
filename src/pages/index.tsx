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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#333', color: '#fff', margin: 0 }}>
      <header style={{ fontSize: '2em', marginBottom: '1em' }}>My Chitty Chatty Bot 🤖</header>
      <p style={{ marginBottom: '1em', textAlign: 'center' }}>This is an extremely simple, work-in-progress chatbot. Just a starting point, for now. Type your message and press send to interact with it.</p>
      <p style={{ marginBottom: '1em', textAlign: 'center' }}>No transcripts are saved from the chat. Note that I want to, but I just do not know how yet lol. So no worries about privacy.</p>
      <div style={{ padding: '1em', backgroundColor: '#444', borderRadius: '1em', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '90%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '1em' }}>
          {messages.map((message, index) => (
            <p key={index} style={{ marginBottom: '0.5em', color: message.role === 'assistant' ? 'lightblue' : 'lightgreen' }}>
              <strong>{message.role}:</strong> {message.content}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ display: 'flex' }}>
          <input value={input} onChange={e => setInput(e.target.value)} style={{ flexGrow: 1, marginRight: '0.5em', padding: '0.5em', border: '1px solid #ccc', borderRadius: '0.5em', backgroundColor: '#555', color: '#fff' }} />
          <button type="submit" style={{ padding: '0.5em', backgroundColor: 'blue', color: 'white', borderRadius: '0.5em' }}>Send</button>
        </form>
      </div>
    </div>
  );
}