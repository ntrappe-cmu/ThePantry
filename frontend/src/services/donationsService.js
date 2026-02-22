/**
 * Donations Service
 *
 * Handles API calls related to browsing donations.
 * Currently stubbed—will connect to backend later.
 */

/**
 * Fetch total donation count for a specific region.
 *
 * @param {string} region - Region code (e.g. 'PA', 'CA')
 * @returns {Promise<object>} { success: boolean, count?: number, error?: string }
 */
export const fetchDonationCountForRegion = async (region) => {
  try {
    // TODO: Replace with actual backend call
    // Stubbed as:
    //   const response = await fetch(`/api/donations/count?region=${region}`);
    //   const data = await response.json();
    //   return { success: true, count: data.count };

    await new Promise((resolve) => setTimeout(resolve, 300));

    const donationDataByRegion = {
      PA: [
        { donationId: 2001, title: 'Fresh Bread Box', expirationDate: '2026-02-24' },
        { donationId: 2002, title: 'Dairy Bundle', expirationDate: '2026-02-23' },
        { donationId: 2003, title: 'Canned Goods Pack', expirationDate: '2026-03-10' },
      ],
      CA: [
        { donationId: 3001, title: 'Produce Crate', expirationDate: '2026-02-25' },
        { donationId: 3002, title: 'Prepared Meals', expirationDate: '2026-02-22' },
      ],
    };

    return {
      success: true,
      count: (donationDataByRegion[region] || []).length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch donation count',
    };
  }
};

/**
 * Fetch up to N donations for a specific region.
 * (To make sure we can selectively populate DOM and not overwhelm it)
 *
* @param {string} region - Region code (e.g. 'PA', 'CA')
* @param {number} limit - Max number of donations to fetch
* @returns {Promise<object>} { success: boolean, donations?: Array<{donationId:number, title:string, expirationDate:string}>, error?: string }
 */
export const fetchDonationsForRegion = async (region, limit) => {
  try {
    // TODO: Replace with actual backend call
    // STubbed as:
    //   const response = await fetch(`/api/donations?region=${region}&limit=${limit}`);
    //   const data = await response.json();
    //   return { success: true, donations: data.donations };

    await new Promise((resolve) => setTimeout(resolve, 200));

    const donationDataByRegion = {
      PA: [
        { donationId: 2001, title: 'Fresh Bread Box', expirationDate: '2026-02-24' },
        { donationId: 2002, title: 'Dairy Bundle', expirationDate: '2026-02-23' },
        { donationId: 2003, title: 'Canned Goods Pack', expirationDate: '2026-03-10' },
      ],
      CA: [
        { donationId: 3001, title: 'Produce Crate', expirationDate: '2026-02-25' },
        { donationId: 3002, title: 'Prepared Meals', expirationDate: '2026-02-22' },
      ],
    };

    const requestedLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
    const donations = (donationDataByRegion[region] || []).slice(0, requestedLimit);

    return {
      success: true,
      donations,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch donations',
    };
  }
};

/**
 * Request a donation.
 *
 * @param {number|string} donationId - Donation ID being requested
 * @param {number|string|undefined|null} userId - Optional user ID when backend cannot infer from session
 * @returns {Promise<object>} { success: boolean, error?: string }
 */
export const requestDonation = async (donationId, userId = null) => {
  try {
    // TODO: Replace with actual backend call
    // await fetch('/api/donations/request', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ donationId, userId }),
    // });

    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!donationId) {
      return {
        success: false,
        error: 'donationId is required',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to request donation',
    };
  }
};
