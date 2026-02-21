/**
 * App.jsx
 * 
 * Root application component. Serves as the main container for:
 * - Managing application state and view switching
 * - Rendering dynamic components based on user interactions
 * - Handling communication between child components
 * - Coordinating API calls to the backend (via services layer)
 * 
 * Future enhancements:
 * - Replace event-based communication with proper state management (Context/Redux)
 * - Fetch data from backend services and pass as props to child components
 * - Manage loading/error states for API calls
 */

import { useState } from 'react';
import './App.css';
import MenuBar from './components/MenuBar/menu-bar';
import { VIEWS } from './constants/views.js';


function App() {
  // Tracks which view/page should be displayed to the user
  const [currentView, setCurrentView] = useState(VIEWS.HOME);

  /**
   * Handle navigation view changes from MenuBar component
   * Updates the current view state when user clicks a menu item
   * 
   * @param {string} view - The view name to switch to (from VIEWS constants)
   */
  const handleNavigate = (view) => {
    setCurrentView(view);
    console.log(`Switched to view: ${view}`);
  };

  return (
    <>
      <div className='scrollable-container'>
        {/* Cards go here */}
      </div>
      <MenuBar activeView={currentView} onNavigate={handleNavigate} />
    </>
  );
}

export default App;
