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

import { useState, useEffect } from 'react';
import './App.css';
import MenuBar from './components/MenuBar/menu-bar';
import { EVENTS } from './constants/events.js';


function App() {
  // Tracks which view/page should be displayed to the user
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    /**
     * Listen for menuBarSwitch events from MenuBar component
     * Updates the current view when a menu item is clicked
     */
    const handleMenuSwitch = (event) => {
      const { view } = event.detail;
      setCurrentView(view);
      console.log(`Switched to view: ${view}`);
    };

    document.addEventListener(EVENTS.NAVIGATION_CHANGED, handleMenuSwitch);

    // Cleanup: remove event listener on component unmount
    return () => {
      document.removeEventListener(EVENTS.NAVIGATION_CHANGED, handleMenuSwitch);
    };
  }, []);

  return (
    <>
      <div className='scrollable-container'>
        {/* Cards go here */}
      </div>
      <MenuBar />
    </>
  );
}

export default App;
