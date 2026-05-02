import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ElectionTimelineWidget from './ElectionTimelineWidget';

describe('ElectionTimelineWidget Component', () => {
  const phases = [
    { title: 'Phase 1', desc: 'Desc 1', date: 'Date 1' },
    { title: 'Phase 2', desc: 'Desc 2', date: 'Date 2' }
  ];

  it('renders correctly with given phases', () => {
    render(<ElectionTimelineWidget phases={phases} currentPhaseIdx={0} />);
    
    expect(screen.getByText('Phase 1')).toBeDefined();
    expect(screen.getByText('Desc 2')).toBeDefined();
    expect(screen.getByText('Date 1')).toBeDefined();
  });

  it('assigns correct classes based on currentPhaseIdx', () => {
    const { container } = render(<ElectionTimelineWidget phases={phases} currentPhaseIdx={1} />);
    
    const steps = container.querySelectorAll('.timeline-step');
    expect(steps[0].className).toContain('completed');
    expect(steps[1].className).toContain('active');
  });

  it('renders nothing when empty', () => {
    const { container } = render(<ElectionTimelineWidget phases={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
