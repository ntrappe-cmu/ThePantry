import React from 'react';
import styled from 'styled-components';

/**
 * Styled elements for progress bar subcomponents
 */

const StyledProgressBarFilled = styled.div`
  height: 100%;
  border-radius: var(--progress-bar-radius);
  /* Smoothly animate width changes */
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const StyledProgressBarContainer = styled.div`
  width: 100%; /* Fill available horizontal space */
  height: var(--progress-bar-height);
  background-color: var(--bg-progress-track);
  border-radius: var(--progress-bar-radius);
  overflow: hidden; /* Ensures fill doesn't bleed past rounded corners */
  display: flex;
  margin-bottom: var(--card-details-padding); /* Standard spacing */
`;

/**
 * ProgressBar Component - renders a horizontal progress bar based on a decimal input (0-1)
 * @param {number} progress - Decimal from 0 to 1
 * @param {boolean} isDelayed - Optional flag to turn bar red
 * @returns {React.ReactElement} The progress bar subcomponent
 **/

const ProgressBar = ({ progress, isDelayed }) => {

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
    <StyledProgressBarContainer className="progress-bar-container" role="progressbar" aria-valuenow={Math.round(percentage)} aria-valuemin="0" aria-valuemax="100">
      <StyledProgressBarFilled style={fillStyle} />
    </StyledProgressBarContainer>
  );
};

export default ProgressBar;