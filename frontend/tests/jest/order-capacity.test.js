import { canRequestMoreOrders, isDonationRequestDisabled } from '../../src/utils/orderCapacity.js';

describe('order capacity gating', () => {
  it('allows request when order count is below max', () => {
    expect(canRequestMoreOrders(2, 4)).toBe(true);
    expect(isDonationRequestDisabled(2, 4)).toBe(false);
  });

  it('blocks request when order count equals max', () => {
    expect(canRequestMoreOrders(4, 4)).toBe(false);
    expect(isDonationRequestDisabled(4, 4)).toBe(true);
  });

  it('blocks request when order count is above max', () => {
    expect(canRequestMoreOrders(5, 4)).toBe(false);
    expect(isDonationRequestDisabled(5, 4)).toBe(true);
  });

  it('supports string-like numeric inputs safely', () => {
    expect(canRequestMoreOrders('3', '4')).toBe(true);
    expect(canRequestMoreOrders('4', '4')).toBe(false);
  });
});
