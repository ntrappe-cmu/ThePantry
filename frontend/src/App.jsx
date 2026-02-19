import { useState } from 'react';
import './App.css';
import MenuBar from './components/menu-bar';
import DonationCard from './components/donation-card';

function App() {

  return (
    <>
      <div className='scrollable-container'>
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
        <DonationCard />
      </div>
      <MenuBar />
    </>
  );
}

export default App;
