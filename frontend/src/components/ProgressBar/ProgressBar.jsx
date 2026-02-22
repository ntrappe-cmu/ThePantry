import React from 'react';

/**
 * ProgressBar Component
 * Renders a horizontal progress bar based on a decimal input (0-1).
 * @param {number} progress - Decimal from 0 to 1
 * @param {boolean} isDelayed - Optional flag to turn the bar red
 **/

const ProgressBar = ({ progress = 0, isDelayed = false }) => {

  // Clamp progress between 0 and 1
  const validatedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = validatedProgress * 100;

  // Determine which CSS variable to use for the fill
  // Defaults to green gradient, swaps to red if isDelayed is true
  const fillStyle = {
    width: `${percentage}%`,
    background: isDelayed ? 'var(--fg-color-alert)' : 'var(--gradient-progress)',
  };

  return (
    <div 
      className="progress-bar-container"
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div 
        className="progress-bar-fill" 
        style={fillStyle}
      />
    </div>
  );
};

export default ProgressBar;