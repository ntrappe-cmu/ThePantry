import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  font-size: 0.8rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border-color-primary);

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--border-color-primary);
  }

  thead th {
    color: var(--fg-color-secondary);
    font-weight: 400;
    padding-bottom: 10px;
  }
  
  caption {
    font-weight: 600;
    font-size: 0.7rem;
    margin-bottom: 5px;
  }

`;

const formatTimestamp = (value) => {
  if (!value) return "Unknown";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const rounded = new Date(parsed);
  if (rounded.getSeconds() > 0 || rounded.getMilliseconds() > 0) {
    rounded.setMinutes(rounded.getMinutes() + 1);
  }
  rounded.setSeconds(0, 0);

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(rounded);
};

const getTimeValue = (value) => {
  if (!value) return Number.POSITIVE_INFINITY;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed.getTime();
};

function HistoryLog({
  donationName = "Unknown donation",
  requestedAt = null,
  pickedUpAt = null,
}) {
  const records = [];

  if (requestedAt) {
    records.push({ action: "Order requested", time: requestedAt });
  }

  if (pickedUpAt) {
    records.push({ action: "Order picked up", time: pickedUpAt });
  }

  if (records.length === 0) {
    records.push({ action: "No history yet", time: "-" });
  } else {
    records.sort((a, b) => getTimeValue(a.time) - getTimeValue(b.time));
  }

  return (
    <StyledWrapper>
      <StyledTable>
        <caption>{donationName}</caption>
        <thead>
          <tr>
            <th scope="col">Action</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={`${record.action}-${index}`}>
              <td>{record.action}</td>
              <td>{formatTimestamp(record.time)}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledWrapper>
  );
}

export default HistoryLog;
