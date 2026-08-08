import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { CHAT_HISTORY, SUGGESTED_Q } from '../../utils/constants.js';
// import { sendMessage } from '../../services/chatbotService';

const INITIAL_MESSAGES = [
  { from: 'ai', text: "Namaste Ramesh! I'm your farm assistant. Ask me anything about your crops, soil, weather, or mandi prices." },
  { from: 'user', text: 'My tomato leaves are turning yellow near the bottom, should I be worried?' },
  { from: 'ai', text: "That pattern usually points to early blight or a nitrogen deficiency. Can you upload a photo of an affected leaf? I'll run a quick disease scan and give you a treatment plan." },
];

export default function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    // Replace with: const reply = await sendMessage(value);
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'ai', text: "Got it — based on today's weather and your soil readings, here's what I'd suggest. (This is a demo response.)" }]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Assistant</div>
        <h1>AI Chat</h1>
      </div>

      <div className="chat-shell">
        <Card title="History">
          {CHAT_HISTORY.map((c) => (
            <div className="chat-history-item" key={c} onClick={() => send(c)}>{c}</div>
          ))}
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div className={`msg-row ${m.from === 'user' ? 'user' : ''}`} key={i}>
                <span
                  className="msg-avatar"
                  style={m.from === 'ai'
                    ? { background: 'var(--accent)', color: '#0F1F14' }
                    : { background: 'var(--accent-soft)', color: 'var(--accent-dark)' }}
                >
                  {m.from === 'ai' ? '🌱' : 'RK'}
                </span>
                <div className={`msg-bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="suggested-row">
            {SUGGESTED_Q.map((q) => (
              <button className="suggested-chip" key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your crops, soil, or weather..."
            />
            <button type="submit" className="btn btn-primary btn-sm">Send</button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
