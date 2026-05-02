import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SuggestedQuestionChips from './SuggestedQuestionChips';

describe('SuggestedQuestionChips Component', () => {
  it('renders correctly and calls onSelect', () => {
    const mockSelect = vi.fn();
    const questions = ['Question 1', 'Question 2'];
    
    render(<SuggestedQuestionChips questions={questions} onSelect={mockSelect} />);
    
    const chip1 = screen.getByText('Question 1');
    const chip2 = screen.getByText('Question 2');
    
    expect(chip1).toBeDefined();
    expect(chip2).toBeDefined();
    
    fireEvent.click(chip1);
    expect(mockSelect).toHaveBeenCalledWith('Question 1');
  });

  it('renders nothing when empty', () => {
    const { container } = render(<SuggestedQuestionChips questions={[]} onSelect={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
