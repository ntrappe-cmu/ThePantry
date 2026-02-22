/**
 * LoginModal Component
 * 
 * Presents the login form UI with all styling and presentation logic.
 * Receives all state and callbacks as props—purely a presentational component.
 * 
 * Props:
 * - formData: { email: string, password: string }
 * - onInputChange: function - called when user types in input
 * - onSubmit: function - called when form is submitted
 * - isLoading: boolean - shows loading state on button
 * - isLocked: boolean - disables inputs when locked
 */

import React from 'react';
import styled from 'styled-components';

const StyledLoginModalWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button`
  background: var(--btn-color-primary);
  border-radius: var(--login-button-edges);
  padding: var(--login-button-padding);
  width: var(--login-button-width);
  min-width: fit-content;
  color: white;
  transition: background-color 0.3s ease;

  /* Locked/disabled state */
  &:disabled {
    background-color: var(--btn-color-disabled);
    cursor: not-allowed;
  }
`;

const StyledCredentialsWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: var(--login-text-input-gap);
  margin-bottom: var(--login-button-input-gap);
  width: 100%;
  border: 1px solid var(--border-color-primary);
  border-radius: var(--login-input-edges);
  background: none;
  transition: border-color 0.3s ease;

  /* Blue border when any input inside is focused */
  &:focus-within {
    border-color: var(--fg-color-highlight);
  }

  input {
    width: 100%;
    background: none;
    padding: var(--login-input-padding);
    color: var(--fg-color-primary);
    border: none;
    outline: none;

    &::placeholder {
      color: var(--fg-color-secondary);
    }

    &:last-child {
      border-top: 1px solid var(--border-color-primary);
    }

    /* Locked/disabled state */
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

function LoginModal({ formData, onInputChange, onSubmit, isLoading, isLocked }) {
  return (
    <StyledLoginModalWrapper onSubmit={onSubmit}>
      <h3>Sign in to The Pantry</h3>

      <StyledCredentialsWrapper >
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          maxLength="200"
          value={formData.email}
          onChange={onInputChange}
          disabled={isLocked || isLoading}
        />
        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          maxLength="50"
          value={formData.password}
          onChange={onInputChange}
          disabled={isLocked || isLoading}
        />
      </StyledCredentialsWrapper>
      {/* Submit Button */}
      <StyledButton type="submit" disabled={isLocked || isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </StyledButton>
    </StyledLoginModalWrapper>
      
  );
}

export default LoginModal;