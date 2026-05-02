import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

/**
 * Renders an accessible modal overlay for selecting the user's Indian State or UT.
 * Essential for providing localized election context to the backend.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback fired when a state is selected and submitted.
 * @returns {JSX.Element} The Location Picker modal.
 */
export default function LocationPicker({ onComplete }) {
  const [state, setState] = useState('');
  const selectRef = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  const handleComplete = () => {
    if (state) {
      onComplete({ state });
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <main className="modal-content">
        <h2 id="modal-title" className="modal-title">Welcome to ElectionGuide 🗳️</h2>
        <p className="modal-desc">
          To give you the most accurate deadlines and rules for India, please select your State or Union Territory.
        </p>

        <div className="select-group">
          <label htmlFor="state-select">State / Union Territory</label>
          <select 
            id="state-select"
            ref={selectRef}
            className="select-input"
            value={state} 
            onChange={(e) => setState(e.target.value)}
            aria-required="true"
          >
            <option value="" disabled>Select your region</option>
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleComplete}
          disabled={!state}
          aria-disabled={!state}
        >
          Start Chatting
        </button>
      </main>
    </div>
  );
}

LocationPicker.propTypes = {
  onComplete: PropTypes.func.isRequired
};
