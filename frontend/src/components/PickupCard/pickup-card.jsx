/**
 * PickupCard Component
 * 
 * A reusable card component for displaying donation and hold information with two states: pending pickup and completed pickup.
 * Features:
 * - Completely modular construction
 * - Can either use a "default" card construction or create own card using sub-components
 * - Basic handling for incomplete values or missing
 * - Payload passback with holdID and isPickedUp variables
 * - Card updates on status (item picked up or not)
 * @component PickupCard
 */

import React, { useState, useEffect } from 'react';
// import ItemInfo from './ItemInfo/item-info.jsx';
import ProgressBar from '../ProgressBar/ProgressBar.jsx'

/**
 * PickupCard Component
 * 
 * Displays donation and hold information with two states: pending pickup and completed pickup.
 * 
 * @returns {React.ReactElement} The pickupCard comp
 */

// Main wrapper component, donationData is whatever information in specific schema from DB
function PickupCard({children, donationData, onStatusChange = () => {}}) {
  const [pickedUp, setPickedUp] = useState(false);

    // Toggle status when the action button is clicked
    // Additionally, pass the payload back
    const toggleStatus = () => {
        const nextStatus = !pickedUp;
        setPickedUp(nextStatus);

        // Pass back payload
        // Note, need a workaround for custom buildout and no specification of donationDataID
        onStatusChange({
            holdId: donationData?.id,
            isPickedUp: nextStatus
        });
    };

  // TLDR: We see if custom children exist and let whoever is using this assemble it in a custom manner.
  // If the children don't really exist, we just take in the donationData and built it according to that input.
  const content = children ? (

    // Custom config using custom child elements
    React.Children.map(children, (child) => {
      return React.cloneElement(child, { pickedUp, toggleStatus });
    })
  ) : (
    // Prebuilt using donationData schema
    <>
      <StatusHeader pickedUp={pickedUp}>
        {donationData?.availability}
      </StatusHeader>

      <ProgressBar progress={donationData?.progress} />

      {/*ItemInfo Goes Here*/}
      
      <DonationNumber>
        {donationData?.number}
      </DonationNumber>
      
      <Location>
        {donationData?.address}
      </Location>
      
      <ContactInfo>
        {donationData?.contact}
      </ContactInfo>

      <ActionButton pickedUp={pickedUp} toggleStatus={toggleStatus} />
    </>
  );

  return (
    // Pickup card padfix is really just another wrapper to cheat the edge padding; likely will be replace with whole app container gap later, if using flexbox
    <div className="pickup-card-padfix">
        <div className="pickup-card-wrapper">
            {content}
        </div>
    </div>
  )
}

// Define sub-components
function StatusHeader({children, pickedUp}) {
  return (
    <div className="status-header">
        <span className={`small-status ${pickedUp ? 'fg-color-success' : 'fg-color-primary'}`}>{pickedUp ? "✓ Complete" : "Pickup Status"}</span>
        <h3 className="big-status">{children}</h3>
    </div>
  );
}

function DonationNumber({children}) {
  return (
    <div className="pc-details-line">
        <span className="label">Donation Number</span>
        <span className="value">{children}</span>
    </div>
  );
}

function Location({children}) {
  return (
    <div className="pc-details-line">
        <span className="label">Pickup At</span>
        <a className="value" href="#">{children}</a>
    </div>
  );
}

function ContactInfo({children}) {
  return (
    <div className="pc-details-line">
        <span className="label">Contact Info</span>
        <span className="value">{children}</span>
    </div>
  );
}

function ActionButton({toggleStatus, pickedUp}) {
    if (pickedUp) return null;

    return <button type="button" className="pickup-btn" onClick={toggleStatus}>Mark as Picked Up</button>;
}


// Attach sub-components to main component
PickupCard.StatusHeader = StatusHeader;
PickupCard.DonationNumber = DonationNumber;
PickupCard.Location = Location; 
PickupCard.ContactInfo = ContactInfo;
PickupCard.ActionButton = ActionButton;
PickupCard.ProgressBar = ProgressBar;

export default PickupCard;