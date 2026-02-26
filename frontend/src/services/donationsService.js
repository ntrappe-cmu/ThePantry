/**
 * Donations Service
 *
 * Handles API calls related to browsing and requesting donations.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const DONATIONS_ENDPOINT = `${API_BASE_URL}/api/v1/donations`;
const HOLDS_ENDPOINT = `${API_BASE_URL}/api/v1/holds`;

const REGION_COORDS = {
  PA: { lat: 40.4406, lng: -79.9959, radius: 50 },
  CA: { lat: 34.0522, lng: -118.2437, radius: 50 },
};

const mapDonationForUi = (donation) => ({
  donationId: donation.id,
  title: donation.description,
  expirationDate: donation.expiresAt,
  donationType: donation.donationType,
  quantity: donation.quantity,
  donorName: donation.donorName,
  donorContact: donation.donorContact,
  address: donation.address,
  lat: donation.lat,
  lng: donation.lng,
  isHeld: donation.isHeld,
});

const resolveGeoParams = (regionOrParams) => {
  if (regionOrParams && typeof regionOrParams === 'object') {
    return {
      lat: Number(regionOrParams.lat ?? 0),
      lng: Number(regionOrParams.lng ?? 0),
      radius: Number(regionOrParams.radius ?? 50),
    };
  }

  const regionKey = typeof regionOrParams === 'string' ? regionOrParams.toUpperCase() : '';
  return REGION_COORDS[regionKey] || { lat: 0, lng: 0, radius: 50 };
};

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
 * Fetch total donation count for a specific region.
 *
 * @param {string|object} regionOrParams - Region code (e.g. 'PA') or geo params { lat, lng, radius }
 * @returns {Promise<object>} { success: boolean, count?: number, error?: string }
 */
export const fetchDonationCountForRegion = async (regionOrParams) => {
  try {
    const { lat, lng, radius } = resolveGeoParams(regionOrParams);
    const query = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radius),
    });

    const response = await fetch(`${DONATIONS_ENDPOINT}?${query.toString()}`);
    if (!response.ok) {
      return {
        success: false,
        error: await getErrorMessage(response, 'Failed to fetch donation count'),
      };
    }

    const donations = await response.json();

    return {
      success: true,
      count: Array.isArray(donations) ? donations.length : 0,
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
* @param {string|object} regionOrParams - Region code (e.g. 'PA') or geo params { lat, lng, radius }
* @param {number} limit - Max number of donations to fetch
* @returns {Promise<object>} { success: boolean, donations?: Array<{donationId:number, title:string, expirationDate:string}>, error?: string }
 */
export const fetchDonationsForRegion = async (regionOrParams, limit) => {
  try {
    const { lat, lng, radius } = resolveGeoParams(regionOrParams);
    const query = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radius),
    });

    const response = await fetch(`${DONATIONS_ENDPOINT}?${query.toString()}`);
    if (!response.ok) {
      return {
        success: false,
        error: await getErrorMessage(response, 'Failed to fetch donations'),
      };
    }

    const rawDonations = await response.json();
    const mappedDonations = Array.isArray(rawDonations)
      ? rawDonations.map(mapDonationForUi)
      : [];

    const requestedLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
    const donations = requestedLimit > 0
      ? mappedDonations.slice(0, requestedLimit)
      : mappedDonations;

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
    if (!donationId) {
      return {
        success: false,
        error: 'donationId is required',
      };
    }

    if (userId === null || userId === undefined || userId === '') {
      return {
        success: false,
        error: 'userId is required',
      };
    }

    const response = await fetch(HOLDS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donationId, userId }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: await getErrorMessage(response, 'Failed to request donation'),
      };
    }

    const data = await response.json();

    return {
      success: true,
      hold: data.hold,
      donation: data.donation,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to request donation',
    };
  }
};
