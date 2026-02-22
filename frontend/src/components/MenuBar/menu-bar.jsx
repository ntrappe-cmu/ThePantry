/**
 * MenuBar Component
 * 
 * A responsive navigation menu bar that displays navigation options (Home, orders, History, Account).
 * Features:
 * - Callback-based communication with parent component
 * - Smooth transitions and visual feedback on selection
 * - Styled with styled-components for scoped styling
 * 
 * @component MenuBar
 * @param {Function} onNavigate - Callback function called when a menu option is clicked
 *                                Receives the view name as argument (e.g., 'home', 'orders')
 * @param {string} activeView - The currently active view to highlight the corresponding menu button
 */

import styled from 'styled-components';
import { VIEWS } from '../../constants/views.js';
import { capitalize } from '../../utils/string.js';

/**
 * Styled wrapper for the menu bar container
 * Uses backdrop blur effect and semi-transparent background for a glassmorphism effect
 */
const StyledMenuBarWrapper = styled.nav`
  display: flex;
  width: fit-content;
  max-width: var(--menu-bar-width);
  background-color: var(--bg-color-primary-glass);
  backdrop-filter: var(--bg-blur-primary);
  -webkit-backdrop-filter: var(--bg-blur-primary);
  border-radius: var(--menu-bar-edges);
  transition: background-color .5s ease;
  transition-property: background-color,backdrop-filter,-webkit-backdrop-filter;
  border: 1px solid var(--border-color-primary);
  position: absolute;
  bottom: var(--menu-bar-gap);
  left: 50%; /* centers horizontally */
  transform: translateX(-50%); /* centers */
  padding: var(--menu-bar-padding);
  z-index: 99;
`;

/**
 * Styled button component for individual menu options
 * Includes:
 * - Smooth color and fill transitions (0.3s ease) for visual feedback
 * - Selected state styling with highlight color
 * - SVG icon styling with smooth transitions
 * - Responsive spacing between menu items
 */
const MenuBarOption = styled.button`
  padding: 0;
  margin: 0;
  color: var(--fg-color-secondary);
  transition: color 0.3s ease;

  &:not(:first-child) {
    margin-left: var(--menu-item-spacing);
  }

  h3 {
    color: inherit;
    font-size: 0.9em;
    font-weight: 400;
    margin-top: var(--menu-icon-text-gap);
  }

  svg {
    height: var(--menu-icon-size);
    width: var(--menu-icon-size);
    fill: var(--fg-color-secondary);
    transition: fill 0.3s ease;
  }

  &.selected {
    color: var(--fg-color-highlight);
    svg {
      fill: var(--fg-color-highlight);
    }
  }
`;

/**
 * MenuBar Component (Props-Based)
 * 
 * Displays navigation options and calls the onNavigate callback when a menu option is clicked.
 * The parent component (App.jsx) manages the active view state and passes it down via the activeView prop.
 * This makes data flow explicit: Menu clicks → onNavigate callback → parent state update
 * 
 * @param {string} activeView - The currently active view name (determines which button is highlighted)
 * @param {Function} onNavigate - Callback function called with the view name when a menu option is clicked
 * @returns {React.ReactElement} The menu bar navigation element
 */
function MenuBar({ activeView = VIEWS.HOME, onNavigate = () => {} }) {

  return (
    <StyledMenuBarWrapper className={'menu-bar'}>
      {/* Home Navigation Button */}
      <MenuBarOption className={`menu-option-home ${activeView === VIEWS.HOME ? 'selected' : ''}`} onClick={() => onNavigate(VIEWS.HOME)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M406.15-253.08h36.93v-147.69q23.07 0 39.23-16.15 16.15-16.16 16.15-39.23v-110.77h-36.92v110.77h-18.46v-110.77h-36.93v110.77h-18.46v-110.77h-36.92v110.77q0 23.07 16.15 39.23 16.16 16.15 39.23 16.15v147.69Zm147.7 0h36.92v-313.84q-30.31 0-52.08 21.69t-21.77 52.15v110.77h36.93v129.23ZM180-140v-450l300-225.38L780-590v450H180Z"/></svg>
        <h3>{capitalize(VIEWS.HOME)}</h3>
      </MenuBarOption>
      
      {/* Orders Navigation Button */}
      <MenuBarOption className={`menu-option-orders ${activeView === VIEWS.ORDERS ? 'selected' : ''}`} onClick={() => onNavigate(VIEWS.ORDERS)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M180-180v-476l-74.15-162.31 54.3-25.53L245.69-658h468.62l85.54-185.84 54.3 25.53L780-656v476H180Zm220-270h160q12.75 0 21.37-8.63 8.63-8.63 8.63-21.38 0-12.76-8.63-21.37Q572.75-510 560-510H400q-12.75 0-21.37 8.63-8.63 8.63-8.63 21.38 0 12.76 8.63 21.37Q387.25-450 400-450Z"/></svg>
        <h3>{capitalize(VIEWS.ORDERS)}</h3>
      </MenuBarOption>
      
      {/* History Navigation Button */}
      {/* <MenuBarOption className={`menu-option-history ${activeView === VIEWS.HISTORY ? 'selected' : ''}`} onClick={() => onNavigate(VIEWS.HISTORY)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m480-256.16 146.15-146.15L584-444.46l-74 74v-178h-60v178l-74-74-42.15 42.15L480-256.16ZM215.39-140q-29.93 0-52.66-22.73Q140-185.46 140-215.39v-464.38q0-12.84 4.12-24.5 4.11-11.65 12.34-21.5l56.16-67.92q9.84-12.85 24.61-19.58Q252-820 268.46-820h422.31q16.46 0 31.42 6.73T747-793.69L803.54-725q8.23 9.85 12.34 21.69 4.12 11.85 4.12 24.7v463.22q0 29.93-22.73 52.66Q774.54-140 744.61-140H215.39Zm.23-563.84H744l-43.62-51.93q-1.92-1.92-4.42-3.08-2.5-1.15-5.19-1.15H268.85q-2.69 0-5.2 1.15-2.5 1.16-4.42 3.08l-43.61 51.93Z"/></svg>
        <h3>{capitalize(VIEWS.HISTORY)}</h3>
      </MenuBarOption> */}
      
      {/* Account Navigation Button */}
      {/* <MenuBarOption className={`menu-option-account ${activeView === VIEWS.ACCOUNT ? 'selected' : ''}`} onClick={() => onNavigate(VIEWS.ACCOUNT)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M572.08-476.38Q610-514.31 610-568.46t-37.92-92.08q-37.93-37.92-92.08-37.92t-92.08 37.92Q350-622.61 350-568.46t37.92 92.08q37.93 37.92 92.08 37.92t92.08-37.92ZM212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm-3.85-60h543.08q4.23-4.15 5.77-18.58 1.54-14.42 2.69-19.73-54-53-125.5-83.5T480-352.31q-83 0-154.5 30.5T200-238.31q1.15 5.31 2.69 19.73 1.54 14.43 5.77 18.58Z"/></svg>
        <h3>{capitalize(VIEWS.ACCOUNT)}</h3>
      </MenuBarOption> */}
    </StyledMenuBarWrapper>
  );
}

export default MenuBar;
