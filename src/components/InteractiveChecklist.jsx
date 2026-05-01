import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

const InteractiveChecklist = React.memo(({ items, title = "Voting Day Checklist" }) => {
  const [completed, setCompleted] = useState({});

  const toggleItem = (idx) => {
    setCompleted(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <section className="checklist" aria-labelledby="checklist-title">
      <div id="checklist-title" className="checklist-title">
        <Check size={18} aria-hidden="true" />
        {title}
      </div>
      <div className="checklist-items" role="list">
        {items.map((item, idx) => {
          const isCompleted = !!completed[idx];
          return (
            <div 
              key={idx} 
              role="listitem"
              className={`check-item ${isCompleted ? 'completed' : ''}`}
            >
              <button 
                className="check-box"
                onClick={() => toggleItem(idx)}
                aria-label={`Mark "${item}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                aria-pressed={isCompleted}
              >
                {isCompleted && <Check size={14} strokeWidth={3} aria-hidden="true" />}
              </button>
              <div className="check-text">{item}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

InteractiveChecklist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string
};

InteractiveChecklist.displayName = 'InteractiveChecklist';
export default InteractiveChecklist;
