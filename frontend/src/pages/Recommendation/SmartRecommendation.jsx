import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { SOIL_DATA } from '../../utils/constants.js';
import { getRecommendation, chatRecommendation } from '../../utils/api.js';

const SUGGESTED = [
  'Should I irrigate today?',
  'How much fertilizer do I need?',
  'Check my soil health',
  'Best crop for this season?',
];

const FALLBACK_GREETING =
  "Hi! I'm your recommendation assistant. Ask me about irrigation, fertilizer dosage, or what to plant next.";

// Very small canned-response engine so the demo feels responsive without a
// backend. Swap this for a real call to getRecommendation(message) once
// the recommendation service is wired up.
function mockReply(message) {
  const m = message.toLowerCase();
  if (m.includes('irrigat') || m.includes('water')) {
    return "Soil moisture is at 45%, a bit low. I'd irrigate this evening for the best absorption — aim for around 2.4L per plant.";
  }
  if (m.includes('fertiliz') || m.includes('nutrient') || m.includes('npk')) {
    return 'Nitrogen is your lowest reading at 58%. A nitrogen top-dressing of about 18kg/acre within the next 3 days should bring it back in range.';
  }
  if (m.includes('soil')) {
    return 'Your soil health overall looks decent — Potassium and pH are strong (81% and 66%), but Nitrogen (58%) and Moisture (45%) need attention this week.';
  }
  if (m.includes('crop') || m.includes('plant') || m.includes('season')) {
    return "Given your current soil profile and the season, tomato or onion would do well here — both tolerate your slightly low nitrogen levels while you correct it.";
  }
  return "Got it — based on your soil and weather data, I'd keep an eye on nitrogen and moisture this week. Ask me about irrigation, fertilizer, or crop choice for specifics.";
}

export default function SmartRecommendation() {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Loading your recommendation...' }]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    const soilByLabel = Object.fromEntries(SOIL_DATA.map((d) => [d.label.toLowerCase(), d.val]));

    getRecommendation({
      crop: 'tomato',
      growth_stage: 'vegetative',
      soil: {
        nitrogen: soilByLabel['nitrogen'] ?? null,
        phosphorus: soilByLabel['phosphorus'] ?? null,
        potassium: soilByLabel['potassium'] ?? null,
        moisture: soilByLabel['moisture'] ?? null,
      },
    })
      .then((res) => {
        setMessages([{ from: 'ai', text: res.simple_advice || FALLBACK_GREETING }]);
      })
      .catch((err) => {
        setMessages([{ from: 'ai', text: `${FALLBACK_GREETING} (Couldn't load live data: ${err.message})` }]);
      });
  }, []);

  const send = async (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    try {
      const res = await chatRecommendation({ message: value });
      const reply = res.simple_advice || "I couldn't come up with specific advice for that — try asking about irrigation, fertilizer, or crop choice.";
      setMessages((m) => [...m, { from: 'ai', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'ai', text: `Something went wrong: ${err.message}` }]);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Recommendations</div>
        <h1>Smart Recommendations</h1>
      </div>

      <div className="chat-shell" style={{ gridTemplateColumns: '220px 1fr' }}>
        <Card title="Soil Snapshot">
          {SOIL_DATA.map((d) => (
            <div key={d.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
                <span style={{ fontWeight: 600 }}>{d.val}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-card-soft)' }}>
                <div style={{ height: '100%', width: `${d.val}%`, borderRadius: 3, background: d.color }} />
              </div>
            </div>
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
                  {m.from === 'ai' ? '💧' : 'RK'}
                </span>
                <div className={`msg-bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="suggested-row">
            {SUGGESTED.map((q) => (
              <button className="suggested-chip" key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about irrigation, fertilizer, or crop choice..."
            />
            <button type="submit" className="btn btn-primary btn-sm">Send</button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
