/**
 * History Service
 *
 * Fetches user history timeline data by combining holds and pickup history.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const HOLDS_ENDPOINT = `${API_BASE_URL}/api/v1/holds`;
const HISTORY_ENDPOINT = `${API_BASE_URL}/api/v1/history`;
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

/**
 * Fetch combined history records for a user.
 *
 * Output shape is directly consumable by HistoryLog:
 * { id, donationName, requestedAt, pickedUpAt }
 */
export const fetchHistoryForUser = async (userId) => {
  try {
    if (userId === null || userId === undefined || userId === '') {
      return {
        success: false,
        error: 'userId is required',
      };
    }

    const holdsQuery = new URLSearchParams({ userId: String(userId) });
    const pickupQuery = new URLSearchParams({ userId: String(userId) });

    const [holdsResponse, pickupHistoryResponse, donationsResponse] = await Promise.all([
      fetch(`${HOLDS_ENDPOINT}?${holdsQuery.toString()}`),
      fetch(`${HISTORY_ENDPOINT}?${pickupQuery.toString()}`),
      fetch(`${DONATIONS_ENDPOINT}?showAll=true`),
    ]);

    if (!holdsResponse.ok) {
      return {
        success: false,
        error: await getErrorMessage(holdsResponse, 'Failed to fetch holds history'),
      };
    }

    if (!pickupHistoryResponse.ok) {
      return {
        success: false,
        error: await getErrorMessage(pickupHistoryResponse, 'Failed to fetch pickup history'),
      };
    }

    const holds = await holdsResponse.json();
    const pickupHistory = await pickupHistoryResponse.json();
    const donations = donationsResponse.ok ? await donationsResponse.json() : [];

    const donationById = new Map(
      (Array.isArray(donations) ? donations : []).map((donation) => [donation.id, donation]),
    );

    const pickupByDonationId = new Map(
      (Array.isArray(pickupHistory) ? pickupHistory : []).map((record) => [record.donationId, record]),
    );

    const records = (Array.isArray(holds) ? holds : [])
      .filter((hold) => hold.status === 'completed')
      .map((hold) => {
      const donation = donationById.get(hold.donationId);
      const pickupRecord = pickupByDonationId.get(hold.donationId);

      return {
        id: hold.id,
        donationName:
          pickupRecord?.donationDescription ||
          donation?.description ||
          `Donation ${hold.donationId}`,
        requestedAt: hold.createdAt || null,
        pickedUpAt: pickupRecord?.completedAt || hold.completedAt || null,
      };
    });

    records.sort((a, b) => {
      const aTime = new Date(a.requestedAt || 0).getTime();
      const bTime = new Date(b.requestedAt || 0).getTime();
      return bTime - aTime;
    });

    return {
      success: true,
      records,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch history',
    };
  }
};
