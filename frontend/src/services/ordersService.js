/**
 * Orders Service
 *
 * Handles API calls related to pickup orders.
 * Currently stubbed—will connect to backend later.
 */

/**
 * Fetch pickup orders for a specific user
 *
 * @param {number|string} userId - User ID
 * @returns {Promise<object>} { success: boolean, orders?: Array<{orderId:number, donationId:number, title:string}>, error?: string }
 */
export const fetchOrdersForUser = async (userId) => {
  try {
    // TODO: Replace with actual backend call
    // Currently stubbed as: 
    //   const response = await fetch(`/api/users/${userId}/orders`);
    //   const data = await response.json();
    //   return { success: true, orders: data.orders };

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      orders: [
        { title: 'Order #1', orderId: 12345, donationId: 101 },
        { title: 'Order #2', orderId: 23456, donationId: 102 },
        { title: 'Big Order #3', orderId: 34567, donationId: 103 },
      ],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch orders',
    };
  }
};

/**
 * Remove an order for a specific user after pickup
 *
 * @param {number|string} userId - User ID
 * @param {number|string} orderId - Order ID to remove
 * @returns {Promise<object>} { success: boolean, error?: string }
 */
export const removeOrderForUser = async (userId, orderId) => {
  try {
    // TODO: Replace with actual backend call
    // const response = await fetch(`/api/users/${userId}/orders/${orderId}`, {
    //   method: 'DELETE',
    // });
    // const data = await response.json();
    // return { success: data.success };

    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to remove order',
    };
  }
};

/**
 * Fetch total order count for a specific user
 *
 * @param {number|string} userId - User ID
 * @returns {Promise<object>} { success: boolean, count?: number, error?: string }
 */
export const fetchOrderCountForUser = async (userId) => {
  try {
    // TODO: Replace with actual backend call
    // const response = await fetch(`/api/users/${userId}/orders/count`);
    // const data = await response.json();
    // return { success: true, count: data.count };

    const result = await fetchOrdersForUser(userId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to fetch order count',
      };
    }

    return {
      success: true,
      count: (result.orders || []).length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch order count',
    };
  }
};