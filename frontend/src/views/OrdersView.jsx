import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PickupCard from '../components/PickupCard/pickup-card';
import { fetchOrdersForUser, removeOrderForUser } from '../services/ordersService';

const StyledOrdersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  margin: auto;
`;

function OrdersView() {
  const [orders, setOrders] = useState([]);
  const userId = 1; // Temp stub value - change when have backend

  /**
   * On first mount, get all orders related to current user.
   * Will add more checks/verification. For now, assume valid order objects
   * with title, orderId, and corresponding donationId.
   */
  useEffect(() => {
    const loadOrders = async () => {
      const result = await fetchOrdersForUser(userId);

      if (result.success) {
        setOrders(result.orders || []);
        return;
      }

      console.error(result.error || 'Failed to load orders');
      setOrders([]);
    };

    loadOrders();
  }, [userId]);

  /**
   * Order card uses this callback to notify us that a donation has been marked
   * as picked up so we should remove it and call the API to sync up.
   * @param {*} orderId unique identifier for order
   * @param {*} donationId corresponding donation
   * @returns nothing
   */
  const handlePickup = async (orderId, donationId) => {
    console.log("Donation ID:", donationId, "Order ID:", orderId);

    const result = await removeOrderForUser(userId, orderId);

    if (!result.success) {
      console.error(result.error || 'Failed to remove order');
      return;
    }

    setOrders(prev => prev.filter(order => order.orderId !== orderId));
  };

  return (
    <StyledOrdersList>
      {orders.map(order => (
        <PickupCard 
          key={order.orderId}
          title={order.title} 
          orderId={order.orderId} 
          donationId={order.donationId}
          onPickup={handlePickup}
        />
      ))}
    </StyledOrdersList>
  );
}

export default OrdersView;
