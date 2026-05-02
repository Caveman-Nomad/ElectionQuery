import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a horizontal scrollable list of suggested questions.
 * Built for accessibility with a semantic navigation wrapper.
 *
 * @param {Object} props - Component props
 * @param {string[]} props.questions - Array of question strings to display.
 * @param {Function} props.onSelect - Callback fired when a chip is clicked.
 * @returns {JSX.Element|null} The chips navigation element or null if empty.
 */
const SuggestedQuestionChips = React.memo(({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <nav className="chips-container" aria-label="Suggested Questions">
      {questions.map((q, idx) => (
        <button 
          key={idx} 
          className="chip" 
          onClick={() => onSelect(q)}
          aria-label={`Ask: ${q}`}
        >
          {q}
        </button>
      ))}
    </nav>
  );
});

SuggestedQuestionChips.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired
};

SuggestedQuestionChips.displayName = 'SuggestedQuestionChips';
export default SuggestedQuestionChips;
