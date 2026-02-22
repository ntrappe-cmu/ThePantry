/**
 * Validation utility functions
 * 
 * Centralized input validation logic for forms across the application.
 * Provides reusable validators for email, password, and other common fields.
 */

/**
 * Validates email format using regex
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * 
 * @param {string} password - The password to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates login credentials
 * 
 * @param {string} email - The email to validate
 * @param {string} password - The password to validate
 * @returns {object} { isValid: boolean, errors: { email: string, password: string } }
 */
export const validateLoginForm = (email, password) => {
  const errors = { email: '', password: '' };

  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  return {
    isValid: !errors.email && !errors.password,
    errors,
  };
};
