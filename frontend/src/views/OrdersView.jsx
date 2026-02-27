import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PickupCard from '../components/PickupCard/pickup-card';
import { fetchOrdersForUser, removeOrderForUser, cancelOrderForUser } from '../services/ordersService';

const StyledOrdersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  margin: auto;
  // Make sure we all content inside can be scrolled above nav bar
  padding-bottom: calc(2 * var(--menu-bar-height));
  border: 1px solid yellow;

  h3 {
    margin-top: 10px;
    font-weight: 300;
    color: var(--fg-color-secondary);
  }
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
  const handlePickup = async ({ orderId, donationId }) => {
    console.log("Donation ID:", donationId, "Order ID:", orderId);

    const result = await removeOrderForUser(userId, orderId);

    if (!result.success) {
      console.error(result.error || 'Failed to remove order');
      return;
    }

    setOrders(prev => prev.filter(order => order.orderId !== orderId));
  };

  const cancelDonation = async ({ orderId, donationId }) => {
    console.log('Cancel donation ID:', donationId, 'Order ID:', orderId);

    const result = await cancelOrderForUser(userId, orderId);
    if (!result.success) {
      console.error(result.error || 'Failed to cancel order');
      return;
    }

    setOrders(prev => prev.filter(order => order.orderId !== orderId));
  };

  return (
    <StyledOrdersList>
      {orders.length === 0 && <h3>No active orders.</h3>}
      {orders.map(order => (
        <PickupCard 
          key={order.orderId}
          pickedUp={false}
          orderId={order.orderId} 
          donationId={order.donationId}
          itemTitle={order.itemTitle}
          itemDescription={order.itemDescription}
          itemQuantity={order.itemQuantity}
          address={order.address}
          contactInfo={order.contactInfo}
          onStatusChange={handlePickup}
          cancelDonation={cancelDonation}
        />
      ))}
    </StyledOrdersList>
  );
}

export default OrdersView;
