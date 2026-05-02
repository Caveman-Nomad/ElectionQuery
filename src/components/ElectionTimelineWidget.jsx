import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an accessible timeline widget to display election phases.
 * Highlights the current phase based on the provided index.
 *
 * @param {Object} props - Component props
 * @param {Array<{title: string, desc: string, date: string}>} props.phases - Election phases to render.
 * @param {number} props.currentPhaseIdx - The zero-indexed current active phase.
 * @returns {JSX.Element|null} The timeline section or null if empty.
 */
const ElectionTimelineWidget = React.memo(({ phases, currentPhaseIdx }) => {
  if (!phases || phases.length === 0) return null;

  return (
    <section className="timeline" aria-label="Election Timeline Progress">
      <div className="timeline-title">Election Timeline</div>
      <div className="timeline-track" role="list">
        {phases.map((phase, idx) => {
          let statusClass = '';
          let ariaStatus = 'Pending';
          if (idx < currentPhaseIdx) {
            statusClass = 'completed';
            ariaStatus = 'Completed';
          } else if (idx === currentPhaseIdx) {
            statusClass = 'active';
            ariaStatus = 'Current';
          }

          return (
            <div 
              key={idx} 
              role="listitem"
              aria-current={idx === currentPhaseIdx ? 'step' : undefined}
              className={`timeline-step ${statusClass}`}
            >
              <div className="step-dot" aria-hidden="true"></div>
              <div className="step-content">
                <h4>{phase.title} <span className="sr-only">({ariaStatus})</span></h4>
                {phase.date && <p>{phase.date}</p>}
                {phase.desc && <p style={{marginTop: '4px'}}>{phase.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

ElectionTimelineWidget.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string,
    date: PropTypes.string
  })).isRequired,
  currentPhaseIdx: PropTypes.number
};

ElectionTimelineWidget.displayName = 'ElectionTimelineWidget';
export default ElectionTimelineWidget;
