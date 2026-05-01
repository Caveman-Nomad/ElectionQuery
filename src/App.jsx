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
    <>
      {!locationCtx ? (
        <LocationPicker onComplete={setLocationCtx} />
      ) : (
        <ChatInterface 
          locationCtx={locationCtx} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}
    </>
  );
}

export default App;
