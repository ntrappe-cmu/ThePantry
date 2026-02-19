import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledCardWrapper = styled.div`
  min-height: 100px;
  width: 90%;
  margin: 0 auto;
  background-color: var(--bg-color-secondary); 
  border: 1px solid var(--border-color-primary);
  border-radius: var(--donation-card-edges);
  margin-bottom: var(--donation-card-gap);
  padding: 10px 15px;
`;

function DonationCard({ children }) {
  return (
    <StyledCardWrapper>
      blah
    </StyledCardWrapper>
  );
}

export default DonationCard;