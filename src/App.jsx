import React, { useState, useEffect } from 'react';
import LocationPicker from './components/LocationPicker';
import ChatInterface from './components/ChatInterface';

function App() {
  const [locationCtx, setLocationCtx] = useState(null);
  const [theme, setTheme] = useState('light');

  // Sync theme with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!locationCtx ? (
        <LocationPicker onComplete={setLocationCtx} />
      ) : (
        <ChatInterface 
          locationCtx={locationCtx} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}
      
      {/* Accessibility & India-Centric Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        fontSize: '0.875rem',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)'
      }} role="contentinfo">
        <p>Need urgent assistance? Call the official Election Commission of India Helpline at <strong>1950</strong>.</p>
        <p>Visit <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)'}} aria-label="Visit the official ECI Voters portal">voters.eci.gov.in</a> for official documentation.</p>
      </footer>
    </div>
  );
}

export default App;
