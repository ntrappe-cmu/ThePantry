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

import { useEffect, useState } from 'react';
import './App.css';
import MenuBar from './components/MenuBar/menu-bar';
import { VIEWS } from './constants/views.js';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import OrdersView from './views/OrdersView';

function App() {
  // Checks whether user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Tracks which view/page should be displayed to the user
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  

  // On mount (first thing), check if user is logged in (rn from localStor)
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth) {
      setIsAuthenticated(true);
    }
  }, []); // Run once

  /**
   * Handle user authentication (TODO add backend for auth)
   */
  const handleLogin = (credentials) => {
    // Validate with backend ...
    setIsAuthenticated(true);
    localStorage.setItem('iisAuthenticated', 'true');
  }

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

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Map views to components (more modular)
  const viewMap = {
    [VIEWS.HOME]: <HomeView />,
    [VIEWS.ORDERS]: <OrdersView />,
    // [VIEWS.HISTORY]: <HistoryView />,
    // [VIEWS.ACCOUNT]: <AccountView />,
  };

  return (
    <>
      <div className='scrollable-container'>
        {viewMap[currentView]}
      </div>
      <MenuBar activeView={currentView} onNavigate={handleNavigate} />
    </>
  );
}

export default App;
