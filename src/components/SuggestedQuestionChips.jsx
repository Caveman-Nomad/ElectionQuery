import React from 'react';
import PropTypes from 'prop-types';

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
