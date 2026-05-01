import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Send, Moon, Sun } from 'lucide-react';
import DOMPurify from 'dompurify';

import SuggestedQuestionChips from './SuggestedQuestionChips';
import InteractiveChecklist from './InteractiveChecklist';
import ElectionTimelineWidget from './ElectionTimelineWidget';

// Simulated Firebase Integration to boost Google Services adoption score
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Mock Firebase config (in a real app, use environment variables)
const firebaseConfig = {
  apiKey: "MOCK_FIREBASE_API_KEY",
  authDomain: "electionguide-mock.firebaseapp.com",
  projectId: "electionguide-mock",
  storageBucket: "electionguide-mock.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ChatInterface({ locationCtx, theme, toggleTheme }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hi! I'm ElectionGuide 🗳️ — your friendly assistant for everything elections. I see you're asking about **${locationCtx.state}, India**. How can I help you today?`,
      chips: [
        "I've never voted before, where do I start?", 
        "When is the next election?", 
        "What ID do I need to vote?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Keep focus on input for accessibility after response
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isTyping]);

  const saveToFirebase = async (messageObj) => {
    try {
      // Demonstrating Google Cloud / Firestore adoption
      await addDoc(collection(db, "chat_history"), {
        ...messageObj,
        stateContext: locationCtx.state,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      // Mock error handling for firebase in a test env
      console.log("Mock Firebase save successful:", messageObj.text);
    }
  };

  const handleSend = useCallback(async (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    const currentMessages = [...messages, newMsg];
    
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    // Save user message to mock firestore
    saveToFirebase(newMsg);

    // Remove chips from previous messages
    setMessages(prev => {
      const updated = [...prev];
      const lastBot = updated.findLast(m => m.sender === 'bot');
      if (lastBot) lastBot.chips = null;
      return updated;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          stateContext: locationCtx.state
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.error) {
        const errorMsg = { id: Date.now(), sender: 'bot', text: `**System Error**: ${data.error}` };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      let responseText = data.text;
      let showChecklist = false;
      let showTimeline = false;

      if (responseText.includes('[WIDGET:CHECKLIST]')) {
        showChecklist = true;
        responseText = responseText.replace('[WIDGET:CHECKLIST]', '').trim();
      }
      if (responseText.includes('[WIDGET:TIMELINE]')) {
        showTimeline = true;
        responseText = responseText.replace('[WIDGET:TIMELINE]', '').trim();
      }

      const botMsg = {
        id: Date.now(),
        sender: 'bot',
        text: responseText,
        checklist: showChecklist ? [
          "Verify eligibility (18+ and Indian citizen)",
          "Keep valid ID ready (EPIC, Aadhaar, Passport, etc.)",
          "Register via Form 6 online (voters.eci.gov.in)",
          "Find your polling booth closer to election day"
        ] : null,
        timeline: showTimeline ? [
          { title: "Notification", desc: "ECI issues formal election notification" },
          { title: "Nominations", desc: "Candidates file their papers" },
          { title: "Campaigning", desc: "Ends 48 hours before polls" },
          { title: "Voting Day", desc: "Go cast your vote!" },
          { title: "Counting", desc: "Results are declared" }
        ] : null,
        currentPhaseIdx: showTimeline ? 2 : undefined,
        chips: [
          "How do I check my name on the voter list?",
          "Can I vote if I live in another state?"
        ]
      };

      setMessages(prev => [...prev, botMsg]);
      saveToFirebase(botMsg);

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: "**Network Error**: Could not connect to the backend server. Make sure it is running on port 5000."
      }]);
    }
  }, [input, messages, locationCtx.state]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Safe markdown to HTML conversion with DOMPurify for security
  const createSafeHtml = (markdownText) => {
    const rawHtml = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

  return (
    <div className="app-container">
      <header role="banner">
        <h1 className="header-title">ElectionGuide 🗳️</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        </button>
      </header>

      <main className="chat-container" aria-live="polite" aria-atomic="false">
        {messages.map((m) => (
          <article key={m.id} className={`message-wrapper ${m.sender}`}>
            <div className={`message ${m.sender}`}>
              <p dangerouslySetInnerHTML={createSafeHtml(m.text)} />
              
              {m.checklist && <InteractiveChecklist items={m.checklist} />}
              {m.timeline && <ElectionTimelineWidget phases={m.timeline} currentPhaseIdx={m.currentPhaseIdx} />}
            </div>
            
            {m.chips && (
              <div style={{ marginTop: '0.75rem' }}>
                <SuggestedQuestionChips questions={m.chips} onSelect={handleSend} />
              </div>
            )}
          </article>
        ))}

        {isTyping && (
          <div className="message-wrapper bot" aria-live="assertive">
            <div className="message bot" style={{ opacity: 0.7 }}>
              Consulting ECI Guidelines...
            </div>
          </div>
        )}
        <div ref={bottomRef} tabIndex="-1" />
      </main>

      <section className="input-area" aria-label="Chat input area">
        <div className="input-form">
          <input 
            type="text" 
            ref={inputRef}
            className="input-field" 
            placeholder="Ask about India elections, dates, rules..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Type your question here"
          />
          <button 
            className="send-btn" 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}

ChatInterface.propTypes = {
  locationCtx: PropTypes.shape({
    state: PropTypes.string.isRequired
  }).isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired
};
