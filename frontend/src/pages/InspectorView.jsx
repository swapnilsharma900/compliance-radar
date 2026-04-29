import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Navigation, Send, MessageSquare, User } from 'lucide-react';

const InspectorView = () => {
  const [completed, setCompleted] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Citizen (Priya)', text: "I've been noticing dark water coming out of the Unit A pipe since morning. The smell is unbearable.", time: '10:45 AM', isMe: false },
    { id: 2, sender: 'System', text: 'Alert generated. Inspector सुरेश मीणा (Suresh Meena) assigned to this task.', time: '10:50 AM', isSystem: true },
    { id: 3, sender: 'Me', text: 'Hello Priya, I am on my way to the Pali Industrial Area. Can you confirm if the discharge is still active?', time: '11:00 AM', isMe: true },
    { id: 4, sender: 'Citizen (Priya)', text: 'Yes, it is still flowing. I am near the back gate. Please hurry, it is reaching the common drain.', time: '11:05 AM', isMe: false },
    { id: 5, sender: 'Me', text: 'Understood. I will be there in 5 minutes. Please stay safe and do not go near the water.', time: '11:07 AM', isMe: true },
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Inspector Portal</h1>

      {!completed ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
          {/* Task Detail Card */}
          <div className="glass-panel" style={{ width: '350px', padding: '1.5rem', borderLeft: '4px solid var(--accent-danger)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span className="badge danger">CRITICAL ALERT</span>
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>10 mins ago</span>
            </div>
            
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle color="var(--accent-danger)" size={20} />
              Pali Textile Dyeing Unit A
            </h2>
            
            <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MapPin size={16} /> Pali Industrial Area, Sector 4
            </p>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Reason for Inspection:</p>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                <li>Sensor WN-PALI-01 triggered (TDS: 2847, pH: 4.2)</li>
                <li>Satellite thermal anomaly detected</li>
                <li>Citizen report via mobile portal</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
              <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
                <Navigation size={18} /> Get Directions
              </button>
              <button 
                onClick={() => setCompleted(true)}
                className="btn-primary" 
                style={{ width: '100%', backgroundColor: 'var(--accent-success)', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
              >
                <CheckCircle size={18} /> Mark as Completed
              </button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
              <MessageSquare size={20} color="var(--accent-primary)" />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Citizen Communication</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Reporting Citizen: Priya Verma</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 600 }}>ONLINE</span>
              </div>
            </div>

            {/* Message Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{ 
                    alignSelf: msg.isSystem ? 'center' : (msg.isMe ? 'flex-end' : 'flex-start'),
                    maxWidth: msg.isSystem ? '90%' : '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  {!msg.isSystem && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', marginLeft: msg.isMe ? 0 : '0.5rem', marginRight: msg.isMe ? '0.5rem' : 0 }}>
                      {msg.sender} • {msg.time}
                    </span>
                  )}
                  
                  <div style={{ 
                    padding: msg.isSystem ? '0.5rem 1rem' : '0.85rem 1.15rem',
                    borderRadius: msg.isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    fontSize: msg.isSystem ? '0.75rem' : '0.95rem',
                    backgroundColor: msg.isSystem ? 'rgba(0,0,0,0.05)' : (msg.isMe ? 'var(--accent-primary)' : 'white'),
                    color: msg.isMe ? 'white' : 'var(--text-primary)',
                    boxShadow: msg.isSystem ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                    border: msg.isMe ? 'none' : '1px solid var(--border-color)',
                    fontStyle: msg.isSystem ? 'italic' : 'normal',
                    textAlign: msg.isSystem ? 'center' : 'left',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', backgroundColor: 'white' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type your reply to Priya..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ borderRadius: '30px', paddingLeft: '1.5rem', height: '48px', border: '1px solid var(--border-color)' }}
              />
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: 'var(--accent-primary)', 
                  color: 'white', 
                  border: 'none', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
            <CheckCircle size={64} color="var(--accent-success)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Inspection Logged!</h2>
          <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '400px' }}>
            The report and complete chat history have been securely archived to the Admin dashboard for review.
          </p>
          <button className="btn-secondary" onClick={() => setCompleted(false)} style={{ padding: '0.75rem 2rem' }}>
            View Pending Tasks
          </button>
        </div>
      )}
    </div>
  );
};

export default InspectorView;
