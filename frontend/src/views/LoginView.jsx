import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginModal from '../components/LoginModal/login-modal';
import { validateLoginForm } from '../utils/validators.js';
import { loginUser } from '../services/authService.js';

const StyledLoginBackground = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color-primary);
  align-items: center;
  justify-content: center;
  margin: auto 0;

  span {
    width: var(--login-modal-width);
  }
`;


function LoginView({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const MAX_ATTEMPTS = 3;

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    console.log('Heard Sign In button click');
    e.preventDefault();

    // Check if locked out
    if (isLocked) {
      return;
    }

    // Validate form locally first
    const validation = validateLoginForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear previous errors and start loading
    setErrors({ email: '', password: '' });
    setLoading(true);

    try {
      // Call auth service
      const response = await loginUser(formData.email, formData.password);

      if (response.success) {
        // Success - switch to authenticated view
        onLogin(response);
        console.log('auth service said OK')
      } else {
        // Handle failed login
        // Clear password field for security
        console.log('auth service said BAD')

        setFormData((prev) => ({
          ...prev,
          password: '',
        }));

        // Increment attempts
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Lock out if too many attempts
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
        }
      }
    } catch (error) {
      // Clear password on error
      setFormData((prev) => ({
        ...prev,
        password: '',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLoginBackground>
      <LoginModal
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={loading}
        isLocked={isLocked}
      />
    </StyledLoginBackground>
  );
}

export default LoginView;