import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LocationPicker from './LocationPicker';

describe('LocationPicker Component', () => {
  it('renders correctly and manages focus', () => {
    const mockComplete = vi.fn();
    render(<LocationPicker onComplete={mockComplete} />);
    
    expect(screen.getByText('Welcome to ElectionGuide 🗳️')).toBeDefined();
    
    const select = screen.getByRole('combobox', { name: /state \/ union territory/i });
    expect(select).toBeDefined();
  });

  it('enables the button only after a state is selected', () => {
    const mockComplete = vi.fn();
    render(<LocationPicker onComplete={mockComplete} />);
    
    const button = screen.getByRole('button', { name: /start chatting/i });
    expect(button.disabled).toBe(true);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Delhi' } });
    
    expect(button.disabled).toBe(false);
    
    fireEvent.click(button);
    expect(mockComplete).toHaveBeenCalledWith({ state: 'Delhi' });
  });
});
