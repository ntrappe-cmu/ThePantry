import styled from 'styled-components';

const StyledCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color-primary);
  min-width: 100px;
  padding: 5px 10px;
  
  button {
    margin-top: 10px;
    background-color: cyan;
    border-radius: 8px;
    padding: 5px;
    width: fit-content;
  }

  p {
    font-size: 0.7rem;
    margin-top: 10px;
  }
`;


// STUB COMPONENT (TODO)
function PickupCard({ title, pickedUp, orderId = 123, donationId, onPickup = () => {} }) {
    
  return (
    <StyledCardWrapper className={'pickup-card'}>
      <h3>{title}</h3>
      <p>Order ID: {orderId}</p>
      <button onClick={() => onPickup(orderId, donationId)}>
        {`${pickedUp ? '' : 'Mark as' } Picked Up`}
      </button>
    </StyledCardWrapper>
  );
}

export default PickupCard;
