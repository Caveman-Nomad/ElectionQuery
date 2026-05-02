import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatInterface from './ChatInterface';

// Mock matchMedia for window
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch
global.fetch = vi.fn();

describe('ChatInterface Component', () => {
  const mockProps = {
    locationCtx: { state: 'Delhi' },
    theme: 'light',
    toggleTheme: vi.fn()
  };

  it('renders correctly with initial message', () => {
    render(<ChatInterface {...mockProps} />);
    expect(screen.getByText(/I see you're asking about/i)).toBeDefined();
    expect(screen.getByText(/Delhi, India/i)).toBeDefined();
  });

  it('handles user input and sends message', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ text: 'Mocked API Response' })
    });

    render(<ChatInterface {...mockProps} />);
    
    const input = screen.getByPlaceholderText(/Ask about India elections/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'When is voting day?' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText('When is voting day?')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Mocked API Response')).toBeDefined();
    });
  });

  it('toggles theme when button clicked', () => {
    render(<ChatInterface {...mockProps} />);
    const themeBtn = screen.getByRole('button', { name: /Switch to dark mode/i });
    fireEvent.click(themeBtn);
    expect(mockProps.toggleTheme).toHaveBeenCalled();
  });
});
