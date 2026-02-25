import styled from 'styled-components';

const StyledCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color-primary);
  border-radius: 8px;
  min-width: 100px;
  padding: 10px 15px;

  p {
    font-size: 0.7rem;
    margin-top: 7px;
    font-weight: 400;
    color: var(--fg-color-secondary);
  }

  button {
    background-color: var(--btn-color-primary);
    color: white;
    margin-top: 20px;
    padding: 5px 15px;
    width: fit-content;
    border-radius: 8px;
  }

  button:disabled {
   background-color: var(--btn-color-disabled);
   color: grey;
  }
`;

// STUB COMPONENT (TODO)
// No knowledge of outside world, is told to be disabled or not
function DonationCard({ title = 'Donation', donationId, expirationDate = 'N/A', onOrder = () => {}, disabled = false }) {
  return (
    <StyledCardWrapper className={'pickup-card'}>
      <h3>{title}</h3>
      <p>Expiration Date: {expirationDate}</p>
      <button onClick={() => onOrder(donationId)} disabled={disabled}>
        Request
      </button>
    </StyledCardWrapper>
  );
}

export default DonationCard;
