/**
 * validators.test.js
 * 
 * Jest unit tests for src/utils/validators.js
 * Tests email, password, and login form validation logic
 */

import { validateEmail, validatePassword, validateLoginForm } from '../../src/utils/validators.js';

describe('validateEmail', () => {
  it('should validate a correct email address', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should validate emails with numbers and special characters', () => {
    expect(validateEmail('test.user+123@example.co.uk')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('should reject email without local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('should reject email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should reject email without TLD', () => {
    expect(validateEmail('user@example')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept a valid password (6+ characters)', () => {
    const result = validatePassword('password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should accept a minimum length password (6 characters)', () => {
    const result = validatePassword('123456');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('should reject password shorter than 6 characters', () => {
    const result = validatePassword('pass');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 6 characters');
  });

  it('should return errors array', () => {
    const result = validatePassword('ab');
    expect(Array.isArray(result.errors)).toBe(true);
  });
});

describe('validateLoginForm', () => {
  it('should validate correct email and password', () => {
    const result = validateLoginForm('user@example.com', 'password123');
    expect(result.isValid).toBe(true);
    expect(result.errors.email).toBe('');
    expect(result.errors.password).toBe('');
  });

  it('should reject invalid email', () => {
    const result = validateLoginForm('invalid-email', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address');
  });

  it('should reject short password', () => {
    const result = validateLoginForm('user@example.com', 'short');
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe('Password must be at least 6 characters');
  });

  it('should reject both invalid email and short password', () => {
    const result = validateLoginForm('invalid', 'short');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.password).toBeTruthy();
  });

  it('should return error object with email and password keys', () => {
    const result = validateLoginForm('', '');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
  });

  it('should accept email with plus sign (for email aliases)', () => {
    const result = validateLoginForm('user+test@example.com', 'password123');
    expect(result.isValid).toBe(true);
  });

  it('should accept long password', () => {
    const result = validateLoginForm('user@example.com', 'this-is-a-very-long-password-123');
    expect(result.isValid).toBe(true);
  });
});
