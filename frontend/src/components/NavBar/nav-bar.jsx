/**
 * NavBar Component
 * 
 * A navigation bar that displays just the site name currently
 * 
 * @component NavBar
 */

import React from 'react';
import styled from 'styled-components';

/**
 * Styled wrapper for the menu bar container
 * Uses backdrop blur effect and semi-transparent background for a glassmorphism effect
 */
const StyledNavBarWrapper = styled.span`
border: 1px solid cyan;
  display: flex;
  width: var(--nav-bar-width);
  height: var(--nav-bar-height);
  background-color: var(--bg-color-primary);
  border-bottom: 1px solid var(--border-color-primary);
  position: absolute;
  top: 0;
  left: 0;
  padding: var(--nav-bar-padding);
  justify-content: center;
  z-index: 98;

  h4 {
    font-size: 0.75rem;
    font-weight: 500;
    align-self: center;
  }
`;

/**
 * NavBar Component
 * 
 * Currently just the title of the site. Will later include navigation elements
 * 
 * @returns {React.ReactElement} The nav bar navigation element
 */
function NavBar() {
  return (
    <StyledNavBarWrapper className={'nav-bar'}>
      <h4>The Pantry</h4>
    </StyledNavBarWrapper>
  );
}

export default NavBar;
