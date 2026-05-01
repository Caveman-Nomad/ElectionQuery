import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InteractiveChecklist from './InteractiveChecklist';

describe('InteractiveChecklist Component', () => {
  const mockItems = ['Step 1', 'Step 2', 'Step 3'];

  it('renders all items correctly', () => {
    render(<InteractiveChecklist items={mockItems} title="Test Checklist" />);
    
    expect(screen.getByText('Test Checklist')).toBeDefined();
    expect(screen.getByText('Step 1')).toBeDefined();
    expect(screen.getByText('Step 2')).toBeDefined();
    expect(screen.getByText('Step 3')).toBeDefined();
  });

  it('toggles item completion state on click', () => {
    render(<InteractiveChecklist items={mockItems} />);
    
    // Find the first button (checkbox)
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    
    // Initially not pressed
    expect(firstButton.getAttribute('aria-pressed')).toBe('false');
    
    // Click to complete
    fireEvent.click(firstButton);
    expect(firstButton.getAttribute('aria-pressed')).toBe('true');
    
    // Click to un-complete
    fireEvent.click(firstButton);
    expect(firstButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('handles empty items array gracefully without crashing', () => {
    render(<InteractiveChecklist items={[]} />);
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
