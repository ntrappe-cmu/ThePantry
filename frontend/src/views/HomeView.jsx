import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DonationCard from '../components/DonationCard/donation-card';
import { fetchDonationCountForRegion, fetchDonationsForRegion, requestDonation } from '../services/donationsService';
import { fetchOrderCountForUser } from '../services/ordersService';
import { canRequestMoreOrders, isDonationRequestDisabled } from '../utils/orderCapacity';

const SEARCH_AREA = { lat: 40.4406, lng: -79.9959, radius: 50 }; // STUB

const StyledDonationsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  margin: 10px auto;
`;

function HomeView() {
  const [donations, setDonations] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const userId = 1; // STUB
  const maxOrders = 4; // STUB

  // Currently calls API everytime view loaded. Not most efficient so could
  // think about locally storing and populating instead
  useEffect(() => {
    const loadDonations = async () => {
      const countResult = await fetchDonationCountForRegion(SEARCH_AREA);

      if (!countResult.success) {
        console.error(countResult.error || 'Failed to load donation count');
        setDonations([]);
        return;
      }

      const donationsResult = await fetchDonationsForRegion(SEARCH_AREA, countResult.count || 0);

      if (donationsResult.success) {
        setDonations(donationsResult.donations || []);
        return;
      }

      console.error(donationsResult.error || 'Failed to load donations');
      setDonations([]);
    };

    loadDonations();
  }, []);

  useEffect(() => {
    const loadOrderCount = async () => {
      const countResult = await fetchOrderCountForUser(userId);

      if (!countResult.success) {
        console.error(countResult.error || 'Failed to load order count');
        setOrderCount(0);
        return;
      }

      console.log('Num of orders for user rn:', countResult.count);
      setOrderCount(countResult.count || 0);
    };

    loadOrderCount();
  }, [userId]);

  // Can remove this but current sanity check on how many orders
  const canRequestMore = canRequestMoreOrders(orderCount, maxOrders);

  const handleOrder = async (donationId) => {
    if (!canRequestMore) {
      console.log('Order limit reached. Request disabled.');
      return;
    }

    const result = await requestDonation(donationId, userId);

    if (!result.success) {
      console.error(result.error || 'Failed to request donation');
      return;
    }

    setDonations((prev) => prev.filter((donation) => donation.donationId !== donationId));
    setOrderCount((prev) => prev + 1);
  };

  return (
    <StyledDonationsList>
      {donations.map((donation) => (
        <DonationCard 
          key={donation.donationId}
          title={donation.title}
          donationId={donation.donationId}
          expirationDate={donation.expirationDate}
          onOrder={handleOrder}
          disabled={isDonationRequestDisabled(orderCount, maxOrders)}
        />
      ))}
    </StyledDonationsList>
  );
}

export default HomeView;