/**
 * Authentication Service
 * 
 * Handles all API calls related to user authentication.
 * Password checking is currently frontend-only for MVP.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const USERS_LOOKUP_ENDPOINT = `${API_BASE_URL}/api/v1/users/lookup`;
const DEMO_PASSWORD = '123456';

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
 * Authenticate user with email and password
 * 
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<object>} { success: boolean, token?: string, error?: string }
 */
export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    // MVP behavior: only check password in frontend, never send it to backend.
    if (password !== DEMO_PASSWORD) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const query = new URLSearchParams({ email });
    const response = await fetch(`${USERS_LOOKUP_ENDPOINT}?${query.toString()}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      return {
        success: false,
        error: await getErrorMessage(response, 'Login failed'),
      };
    }

    const user = await response.json();

    return {
      success: true,
      token: `demo-session-${Date.now()}`,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed. Please try again.',
    };
  }
};

/**
 * Logout user
 * 
 * @returns {Promise<object>} { success: boolean }
 */
export const logoutUser = async () => {
  try {
    // TODO: Replace with actual backend call
    // return fetch('/api/auth/logout', { method: 'POST' })
    //   .then(res => res.json());
    console.log("omg logout");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Verify if a token is still valid
 * 
 * @param {string} token - JWT token to verify
 * @returns {Promise<object>} { isValid: boolean }
 */
export const verifyToken = async (token) => {
  try {
    // TODO: Replace with actual backend call
    // return fetch('/api/auth/verify', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // }).then(res => res.json());

    // STUB: Check if token exists and is recent
    return { isValid: !!token };
  } catch (error) {
    return { isValid: false };
  }
};
