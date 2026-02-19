/**
 * MenuBar Component
 * 
 * A responsive navigation menu bar that displays navigation options (Home, Requests, History, Account).
 * Features:
 * - State management for current active view
 * - Custom DOM event dispatching for cross-component communication
 * - Smooth transitions and visual feedback on selection
 * - Styled with styled-components for scoped styling
 * 
 * @component MenuBar
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Styled wrapper for the menu bar container
 * Uses backdrop blur effect and semi-transparent background for a glassmorphism effect
 */
const StyledMenuBarWrapper = styled.nav`
  width: fit-content;
  max-width: var(--menu-bar-width);
  background-color: rgba(29, 29, 31, 0.7);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: var(--menu-bar-edges);
  transition: background-color .5s ease;
  transition-property: background-color,backdrop-filter,-webkit-backdrop-filter;
  border: 1px solid var(--border-color-primary);
  position: absolute;
  bottom: 5px;
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
    margin-top: -4px;
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
 * MenuBar Component
 * 
 * Manages navigation state and dispatches custom events to notify other components
 * of view changes. Each menu option updates the internal state and emits a 'menuBarSwitch'
 * event with the selected view.
 * 
 * @returns {React.ReactElement} The menu bar navigation element
 */
function MenuBar() {
  // Track the currently selected menu view
  const [view, setView] = useState('home');

  /**
   * Handle menu option click
   * Updates the internal view state and dispatches a custom DOM event
   * to allow other components to react to view changes
   * 
   * @param {string} v - The view name (e.g., 'home', 'requests', 'history', 'account')
   */
  const handleClick = (v) => {
    // Update internal state
    setView(v);
    
    // Dispatch a custom event that other components can listen to
    // Example: document.addEventListener('menuBarSwitch', (e) => { console.log(e.detail.view); })
    const ev = new CustomEvent('menuBarSwitch', { detail: { view: v } });
    document.dispatchEvent(ev);
  };

  return (
    <StyledMenuBarWrapper className={'menu-bar'}>
        {/* Home Navigation Button */}
        <MenuBarOption className={`menu-option-home ${view === 'home' ? 'selected' : ''}`} onClick={() => handleClick('home')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M640-100q-91.54 0-155.77-64.23T420-320q0-91.54 64.23-155.77T640-540q91.54 0 155.77 64.23T860-320q0 91.54-64.23 155.77T640-100Zm0-60q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-467.69-20Q142-180 121-201q-21-21-21-51.31v-289.38q0-8 2.27-17.16 2.27-9.15 5.27-17.15l84.62-191.69h-19.08q-15.08 0-24.46-9.39-9.39-9.38-9.39-24.46v-24.61q0-15.08 9.39-24.46Q158-860 173.08-860h253.84q15.08 0 24.46 9.39 9.39 9.38 9.39 24.46v24.61q0 15.08-9.39 24.46-9.38 9.39-24.46 9.39h-19.08l82.93 188.92q-13.62 7.31-26.19 16-12.58 8.69-24.12 19.62l-97.08-224.54h-86.76L160-545.15v292.84q0 5.39 3.46 8.85t8.85 3.46h178.46q3.85 16 10.23 31.31 6.39 15.3 14.92 28.69H172.31ZM640-587.69q-33.92-3.46-56.96-28.42Q560-641.08 560-676.15q0-35.08 23.04-60.04T640-764.61v176.92q3.46-33.92 28.42-56.96t60.04-23.04q35.08 0 60.04 23.04t28.42 56.96H640Z"/></svg>            <h3>Home</h3>
        </MenuBarOption>
        
        {/* Requests Navigation Button */}
        <MenuBarOption className={`menu-option-requests ${view == 'requests' ? 'selected' : ''}`} onClick={() => handleClick('requests')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h55.38v-84.61h61.54V-820h303.08v-84.61h60V-820h55.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31ZM760-212.31v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46Zm-386.15-73.84h47.69v-159.62q24.84-6.23 41.65-26T480-517v-156.85h-35.38v149.47h-29.23v-149.47H380v149.47h-29.23v-149.47h-35.38V-517q0 25.46 16.8 45.23 16.81 19.77 41.66 26v159.62Zm223.07 0h47.69v-387.31q-45.38 1.92-76.53 35-31.16 33.08-31.16 78.46v113.85h60v160ZM200-212.31V-200v-560V-212.31Z"/></svg>            <h3>Requests</h3>
        </MenuBarOption>
        
        {/* History Navigation Button */}
        <MenuBarOption className={`menu-option-history' ${view == 'history' ? 'selected' : ''}`} onClick={() => handleClick('history')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M479.23-140q-129.92 0-226.46-85.54Q156.23-311.08 141.62-440h61.23Q218-336.38 296.12-268.19 374.23-200 479.23-200q117 0 198.5-81.5t81.5-198.5q0-117-81.5-198.5T479.23-760q-65.54 0-122.84 29.12-57.31 29.11-98.7 80.11h104.62v60H159.23v-203.08h60v94.77q48.69-57.46 116.62-89.19Q403.77-820 479.23-820q70.77 0 132.62 26.77 61.84 26.77 107.84 72.77t72.77 107.85q26.77 61.84 26.77 132.61 0 70.77-26.77 132.61-26.77 61.85-72.77 107.85-46 46-107.84 72.77Q550-140 479.23-140Zm120.08-178.92L450.39-467.85V-680h59.99v187.85l131.08 131.07-42.15 42.16Z"/></svg>            <h3>History</h3>
        </MenuBarOption>
        
        {/* Account Navigation Button */}
        <MenuBarOption className={`menu-option-account' ${view == 'account' ? 'selected' : ''}`} onClick={() => handleClick('account')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92Zm146.7-219.31Q350-525.23 350-580q0-54.77 37.62-92.38Q425.23-710 480-710q54.77 0 92.38 37.62Q610-634.77 610-580q0 54.77-37.62 92.38Q534.77-450 480-450q-54.77 0-92.38-37.62ZM480-100q-79.15 0-148.5-29.77t-120.65-81.08q-51.31-51.3-81.08-120.65Q100-400.85 100-480t29.77-148.5q29.77-69.35 81.08-120.65 51.3-51.31 120.65-81.08Q400.85-860 480-860t148.5 29.77q69.35 29.77 120.65 81.08 51.31 51.3 81.08 120.65Q860-559.15 860-480t-29.77 148.5q-29.77 69.35-81.08 120.65-51.3 51.31-120.65 81.08Q559.15-100 480-100Zm104.42-77.42q50.27-17.43 89.27-48.73-39-30.16-88.11-47Q536.46-290 480-290t-105.77 16.65q-49.31 16.66-87.92 47.2 39 31.3 89.27 48.73Q425.85-160 480-160t104.42-17.42Zm-54.5-352.66Q550-550.15 550-580t-20.08-49.92Q509.85-650 480-650t-49.92 20.08Q410-609.85 410-580t20.08 49.92Q450.15-510 480-510t49.92-20.08ZM480-580Zm0 355Z"/></svg>            <h3>Account</h3>
        </MenuBarOption>
    </StyledMenuBarWrapper>
  );
}

export default MenuBar;
