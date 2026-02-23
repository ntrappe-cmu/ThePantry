/**
 * PickupCard Component
 * 
 * A reusable card component for displaying donation and hold information. Features:
 * - Completely modular construction
 * - Can either use a "default" card construction or create own card using sub-components
 * - Basic handling for incomplete values or missing functions
 * - Callback returns pickedUpStatus, orderId, and donationId
 * - Card relays whether button was clicked (pickedUp) and wait for confirmation from parent before removing button
 * @component PickupCard
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ItemInfo from '../ItemInfo/ItemInfo.jsx';
import ProgressBar from '../ProgressBar/ProgressBar.jsx'

/**
 * Styled components for PickupCard
 */

const StyledStatusHeader = styled.div`
  padding: var(--card-details-padding) 0px var(--card-details-padding) var(--card-details-padding);
  display: flex;
  flex-direction: column;

  & .small-status {
  font-size: 0.8em;
  margin-bottom: 5px;
  }

  & .fg-color-success {
  color: var(--fg-color-success);
  }

  & .fg-color-secondary {
  color: var(--fg-color-secondary);
  }
`;

const StyledCardPadFix = styled.div`
  padding: var(--card-gap);
`;

const StyledPickupCardWrapper = styled.div`
  background: var(--bg-color-primary-glass);
  backdrop-filter: var(--bg-blur-primary);
  -webkit-backdrop-filter: var(--bg-blur-primary);
  width: var(--card-width);
  display: flex;
  flex-direction: column;
  color: var(--fg-color-primary);
  border-radius: var(--card-border-radius);

  & .progress-bar-container {
  width: calc(100% - 2*(var(--card-border-radius)));
  margin-left: var(--card-border-radius);
  }
`;

const StyledPCDetails = styled.div`
  border-top: 1px solid var(--bg-color-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .label, .value {
  font-size: 0.9em;
  padding: var(--card-details-padding);
  }

  & a {
  color: var(--fg-color-highlight);
  text-decoration: none;
  }
`;

const StyledActionButton = styled.div`
  width: var(--card-button-width);
  padding: var(--card-button-padding);
  transition: background 0.2s ease;
  cursor: pointer;
  background: var(--fg-color-highlight);
  color: var(--fg-color-primary);
  border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
  font-size: 0.8em;
  text-align: center;
`;

/**
 * PickupCard Component
 * 
 * Displays donation and hold information with two states: pending pickup and completed pickup.
 * 
 * Built this so it can either take a custom structure (built with sub-components or other custom sub-elements) or default to the normal card structure
 * Also built this to take in either an object (donationData), which is in a JSON format and will be updated to follow the naming conventions from the API from the DB
 * But, can also take custom input for the sub-components, which are params orderId, donationId, address, contactInfo, progress, isDelayed, itemQuantity, itemImgSrc, itemTitle, itemDescription
 * Either way, just remember you can essentially build the cards how you want, but you need either the donationData object or the custom string params
 * Callback returns pickedUp, orderId, and donationId
 * 
 * @param {object} donationData - Object in JSON format, either is or mimicks info from DB API; not required if other elements specified below
 * @param {boolean} pickedUp - Required, states whether the item has been picked up or not
 * @param {string} orderId - Required, but can be either specified here or in donationData as orderId
 * @param {string} donationId - Required, but can be either specified here or in donationData as donationId
 * @param {string} address - Not technically required, but you'll get the default message if not specified. Address of pickup location
 * @param {string} contactInfo - Not technically required, but you'll get the default message if not specified. Contact info of donator
 * @param {number} itemQuantity - Not technically required, but you'll get default message if not specified. Quantity of item in number form
 * @param {string} itemImgSrc - Not technically required. Image source for the item (url)
 * @param {number} itemTitle - Not technically required, but you'll get default message if not specified. Title of the item
 * @param {number} itemDescription - Not technically required, but you'll get default message if not specified. Description of item
 * @param {Function} onStatusChange - Callback function, will pass pickedUp, orderId, and donationId back
 * @returns {React.ReactElement} The pickupCard component in its entirety
 */

// Main wrapper component, donationData is whatever information in specific schema from DB, other params specified above
function PickupCard({children, donationData, pickedUp, orderId, donationId, address, contactInfo, progress, isDelayed, itemQuantity, itemImgSrc, itemTitle, itemDescription, onStatusChange = () => {}}) {

    // Toggle status when the action button is clicked
    // Additionally, pass the payload back
    const handlePickup = () => {
        const pickedUpStatus = !pickedUp;
        const passbackOrderId = orderId || donationData?.orderId;
        const passbackDonationId = donationId || donationData?.number;

        // I know this looks funny, but just for sake of consistency when passing stuff back
        orderId = passbackOrderId;
        donationId = passbackDonationId;
        pickedUp = pickedUpStatus;

        // Pass back payload
        onStatusChange({pickedUp, orderId, donationId});
    };

  /*
  * TLDR: We see if custom children exist and let whoever is using this assemble it in a custom manner.
  * If the children don't really exist, we just take in the donationData and built it according to that input.
  */
  const content = children ? (

    // Custom config using custom child elements
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      // Check if the child a custom sub-component
      // Many thanks to Gemini for the logic from 124-133
      const isSubComponent = [
        ActionButton, 
        StatusHeader, 
        ProgressBar
      ].includes(child.type);

      return isSubComponent 
        ? React.cloneElement(child, { pickedUp, handlePickup })
        : child; // If it's a <div> or <span>, return it without the extra props
      })
  ) : (
    // Prebuilt using donationData schema
    <>
      <StatusHeader pickedUp={pickedUp}>
        {donationData?.availability}
      </StatusHeader>

      <ProgressBar progress={donationData?.progress || progress} isDelayed={donationData?.isDelayed || isDelayed || ""}/>

      <ItemInfo>
        <ItemInfo.Image src={itemImgSrc || null}/>
        <ItemInfo.Content>
          <ItemInfo.Title>
            {itemTitle || donationData?.itemTitle || "Not provided"}
          </ItemInfo.Title>
          <ItemInfo.Description>
            {itemDescription || donationData?.itemDescription || "Not provided"}
          </ItemInfo.Description>
          <ItemInfo.Quantity value={itemQuantity || donationData?.itemQuantity || "Not provided"} />
        </ItemInfo.Content>
      </ItemInfo>
      
      <DonationNumber>
        {donationId || donationData?.number || "Not provided"}
      </DonationNumber>
      
      <Location>
        {donationData?.address || address || "Not provided"}
      </Location>
      
      <ContactInfo>
        {donationData?.contact || contactInfo || "Not provided"}
      </ContactInfo>

      <ActionButton pickedUp={pickedUp} handlePickup={handlePickup} />
    </>
  );

  return (
    // Pickup card padfix is really just another wrapper to cheat the edge padding; likely will be replace with whole app container gap later, if using flexbox
    <StyledCardPadFix>
        <StyledPickupCardWrapper>
            {content}
        </StyledPickupCardWrapper>
    </StyledCardPadFix>
  )
}

// Define sub-components
function StatusHeader({children, pickedUp}) {
  return (
    <StyledStatusHeader>
        <span className={`small-status ${pickedUp ? 'fg-color-success' : 'fg-color-primary'}`}>{pickedUp ? "✓ Complete" : "Pickup Status"}</span>
        <h3>{children}</h3>
    </StyledStatusHeader>
  );
}

function DonationNumber({children}) {
  return (
    <StyledPCDetails>
        <span className="label">Donation Number</span>
        <span className="value">{children}</span>
    </StyledPCDetails>
  );
}

function Location({children}) {
  return (
    <StyledPCDetails>
        <span className="label">Pickup At</span>
        <a className="value" href="#">{children}</a>
    </StyledPCDetails>
  );
}

function ContactInfo({children}) {
  return (
    <StyledPCDetails>
        <span className="label">Contact Info</span>
        <span className="value">{children}</span>
    </StyledPCDetails>
  );
}

function ActionButton({handlePickup, pickedUp}) {
    if (pickedUp) return null;

    return <StyledActionButton type="button" onClick={handlePickup}>Mark as Picked Up</StyledActionButton>;
}

// Attach sub-components to main component
PickupCard.StatusHeader = StatusHeader;
PickupCard.DonationNumber = DonationNumber;
PickupCard.Location = Location; 
PickupCard.ContactInfo = ContactInfo;
PickupCard.ActionButton = ActionButton;
PickupCard.ProgressBar = ProgressBar;
PickupCard.ItemInfo = ItemInfo;

export default PickupCard;