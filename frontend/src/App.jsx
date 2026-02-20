import { useState, useEffect } from 'react';
import './App.css';
import MenuBar from './components/MenuBar/menu-bar';

function App() {
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

    document.addEventListener('menuBarSwitch', handleMenuSwitch);

    // Cleanup: remove event listener on component unmount
    return () => {
      document.removeEventListener('menuBarSwitch', handleMenuSwitch);
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
