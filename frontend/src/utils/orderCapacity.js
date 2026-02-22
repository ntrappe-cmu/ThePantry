/**
 * Determine whether a user can request another donation based on order capacity.
 *
 * @param {number} orderCount - Current number of user orders
 * @param {number} maxOrders - Maximum allowed concurrent orders
 * @returns {boolean}
 */
export const canRequestMoreOrders = (orderCount, maxOrders) => {
  return Number(orderCount) < Number(maxOrders);
};

/**
 * Determine disabled state for donation request actions.
 *
 * @param {number} orderCount - Current number of user orders
 * @param {number} maxOrders - Maximum allowed concurrent orders
 * @returns {boolean}
 */
export const isDonationRequestDisabled = (orderCount, maxOrders) => {
  return !canRequestMoreOrders(orderCount, maxOrders);
};
