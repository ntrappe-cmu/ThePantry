import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HistoryLog from '../components/HistoryLog/HistoryLog';
import { fetchHistoryForUser } from '../services/historyService';

const StyledHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  margin: 20px auto;

  h3 {
    font-weight: 0.8rem;
    font-weight: 300;
    color: var(--fg-color-secondary);
  }
`;

function HistoryView() {
  const [historyRecords, setHistoryRecords] = useState([]);
  const userId = 1; // Temp stub value - update when auth/user context is wired

  useEffect(() => {
    const loadHistory = async () => {
      const result = await fetchHistoryForUser(userId);

      if (!result.success) {
        console.error(result.error || 'Failed to load history');
        setHistoryRecords([]);
        return;
      }

      setHistoryRecords(result.records || []);
    };

    loadHistory();
  }, [userId]);

  return (
    <StyledHistoryList>
      {historyRecords.length === 0 && <h3>No completed orders.</h3>}

      {historyRecords.map((record) => (
        <HistoryLog
          key={record.id}
          donationName={record.donationName}
          requestedAt={record.requestedAt}
          pickedUpAt={record.pickedUpAt}
        />
      ))}
    </StyledHistoryList>
  );
}

export default HistoryView;