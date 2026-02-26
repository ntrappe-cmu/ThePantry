/**
 * Orders Service
 *
 * Handles API calls related to pickup orders.
 * Orders are represented by active holds in the backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const HOLDS_ENDPOINT = `${API_BASE_URL}/api/v1/holds`;
const DONATIONS_ENDPOINT = `${API_BASE_URL}/api/v1/donations`;

const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const payload = await response.json();
    if (payload?.error) {
      return payload.error;
    }
  } catch {
    // ignore JSON parse errors and use fallback
  }

  return `${fallbackMessage} (${response.status})`;
};

const mapHoldToOrder = (hold, donation = null) => ({
  orderId: hold.id,
  donationId: hold.donationId,
  itemTitle: donation?.donationType || `Donation ${hold.donationId}`,
  itemDescription: donation?.description || 'Not provided',
  itemQuantity: donation?.quantity || 'Not provided',
  address: donation?.address || 'Not provided',
  contactInfo: donation?.donorContact || 'Not provided',
  status: hold.status,
  createdAt: hold.createdAt,
  expiresAt: hold.expiresAt,
});

/**
 * Fetch pickup orders for a specific user
 *
 * @param {number|string} userId - User ID
 * @returns {Promise<object>} { success: boolean, orders?: Array<{orderId:number, donationId:number}>, error?: string }
 */
export const fetchOrdersForUser = async (userId) => {
  try {
    if (userId === null || userId === undefined || userId === '') {
      return {
        success: false,
        error: 'userId is required',
      };
    }

    const query = new URLSearchParams({
      userId: String(userId),
      active: 'true',
    });

    const [holdsResponse, donationsResponse] = await Promise.all([
      fetch(`${HOLDS_ENDPOINT}?${query.toString()}`),
      fetch(`${DONATIONS_ENDPOINT}?showAll=true`),
    ]);

    if (!holdsResponse.ok) {
      return {
        success: false,
        error: await getErrorMessage(holdsResponse, 'Failed to fetch orders'),
      };
    }

    const holds = await holdsResponse.json();
    const donations = donationsResponse.ok ? await donationsResponse.json() : [];

    const donationById = new Map(
      (Array.isArray(donations) ? donations : []).map((donation) => [donation.id, donation]),
    );

    const orders = Array.isArray(holds)
      ? holds.map((hold) => mapHoldToOrder(hold, donationById.get(hold.donationId) || null))
      : [];

    return {
      success: true,
      orders,
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
    if (userId === null || userId === undefined || userId === '') {
      return {
        success: false,
        error: 'userId is required',
      };
    }

    if (!orderId) {
      return {
        success: false,
        error: 'orderId is required',
      };
    }

    const response = await fetch(`${HOLDS_ENDPOINT}/${orderId}/pickup`, {
      method: 'POST',
    });

    if (!response.ok) {
      return {
        success: false,
        error: await getErrorMessage(response, 'Failed to remove order'),
      };
    }

    const data = await response.json();

    return { success: true, record: data.record };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to remove order',
    };
  }
};

/**
 * Cancel an active order for a specific user.
 *
 * @param {number|string} userId - User ID
 * @param {number|string} orderId - Hold/order ID to cancel
 * @returns {Promise<object>} { success: boolean, hold?: object, error?: string }
 */
export const cancelOrderForUser = async (userId, orderId) => {
  try {
    if (userId === null || userId === undefined || userId === '') {
      return {
        success: false,
        error: 'userId is required',
      };
    }

    if (!orderId) {
      return {
        success: false,
        error: 'orderId is required',
      };
    }

    const response = await fetch(`${HOLDS_ENDPOINT}/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return {
        success: false,
        error: await getErrorMessage(response, 'Failed to cancel order'),
      };
    }

    const data = await response.json();
    return {
      success: true,
      hold: data.hold,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to cancel order',
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
