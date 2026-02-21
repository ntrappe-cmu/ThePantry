/**
 * Authentication Service
 * 
 * Handles all API calls related to user authentication.
 * Currently stubbed—will connect to backend later.
 * 
 * TODO: Replace stub implementation with actual backend API calls
 */

/**
 * Authenticate user with email and password
 * 
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<object>} { success: boolean, token?: string, error?: string }
 */
export const loginUser = async (email, password) => {
  try {
    // TODO: Replace with actual backend call
    // return fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // }).then(res => res.json());

    // STUB: Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // STUB: Simulate some test credentials
    if (email === 'test@example.com' && password === '123456') {
      return {
        success: true,
        token: 'fake-jwt-token-' + Date.now(),
        user: { email, id: 1 },
      };
    }

    // STUB: Simulate failed login
    return {
      success: false,
      error: 'Invalid email or password',
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
