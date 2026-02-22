/**
 * login-modal.cy.js
 * 
 * Cypress component tests for src/components/LoginModal/login-modal.jsx
 * Tests form rendering, user interactions, disabled states, and loading states
 */

import LoginModal from '../../../src/components/LoginModal/login-modal.jsx';

describe('LoginModal Component', () => {
  const defaultProps = {
    formData: { email: '', password: '' },
    onInputChange: cy.stub(),
    onSubmit: cy.stub(),
    isLoading: false,
    isLocked: false,
  };

  it('should render the login form', () => {
    cy.mount(<LoginModal {...defaultProps} />);
    
    cy.get('form').should('exist');
    cy.contains('Sign In').should('be.visible');
  });

  it('should render email and password input fields', () => {
    cy.mount(<LoginModal {...defaultProps} />);
    
    cy.get('input[type="email"]').should('exist').and('be.visible');
    cy.get('input[type="password"]').should('exist').and('be.visible');
  });

  it('should allow typing in email field', () => {
    const onInputChange = cy.stub();
    cy.mount(
      <LoginModal
        {...defaultProps}
        onInputChange={onInputChange}
      />
    );
    
    cy.get('input[type="email"]')
      .type('user@example.com')
      .then(() => {
        expect(onInputChange.called).to.be.true;
      });
  });

  it('should allow typing in password field', () => {
    const onInputChange = cy.stub();
    cy.mount(
      <LoginModal
        {...defaultProps}
        onInputChange={onInputChange}
      />
    );
    
    cy.get('input[type="password"]')
      .type('password123')
      .then(() => {
        expect(onInputChange.called).to.be.true;
      });
  });

  it('should call onInputChange when email value changes', () => {
    const onInputChange = cy.stub();
    cy.mount(
      <LoginModal
        {...defaultProps}
        onInputChange={onInputChange}
      />
    );
    
    cy.get('input[type="email"]').type('test');
    cy.wrap(onInputChange).should('have.been.called');
  });

  it('should call onInputChange when password value changes', () => {
    const onInputChange = cy.stub();
    cy.mount(
      <LoginModal
        {...defaultProps}
        onInputChange={onInputChange}
      />
    );
    
    cy.get('input[type="password"]').type('pass');
    cy.wrap(onInputChange).should('have.been.called');
  });

  it('should call onSubmit when form is submitted', () => {
    const onSubmit = cy.stub().as('submitStub');
    cy.mount(
      <LoginModal
        {...defaultProps}
        onSubmit={onSubmit}
      />
    );
    
    cy.get('form').submit();
    cy.get('@submitStub').should('have.been.called');
  });

  it('should display button text "Sign In" when not loading', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={false} />);
    
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should display button text "Loading..." when loading', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={true} />);
    
    cy.contains('button', 'Loading...').should('be.visible');
  });

  it('should disable email input when isLocked is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLocked={true} />);
    
    cy.get('input[type="email"]').should('be.disabled');
  });

  it('should disable password input when isLocked is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLocked={true} />);
    
    cy.get('input[type="password"]').should('be.disabled');
  });

  it('should disable button when isLocked is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLocked={true} />);
    
    cy.get('button').should('be.disabled');
  });

  it('should disable email input when isLoading is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={true} />);
    
    cy.get('input[type="email"]').should('be.disabled');
  });

  it('should disable password input when isLoading is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={true} />);
    
    cy.get('input[type="password"]').should('be.disabled');
  });

  it('should disable button when isLoading is true', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={true} />);
    
    cy.get('button').should('be.disabled');
  });

  it('should display formData values in input fields', () => {
    const formData = { email: 'test@example.com', password: 'secret123' };
    cy.mount(<LoginModal {...defaultProps} formData={formData} />);
    
    cy.get('input[type="email"]').should('have.value', 'test@example.com');
    cy.get('input[type="password"]').should('have.value', 'secret123');
  });

  it('should enable inputs and button when not loading and not locked', () => {
    cy.mount(<LoginModal {...defaultProps} isLoading={false} isLocked={false} />);
    
    cy.get('input[type="email"]').should('not.be.disabled');
    cy.get('input[type="password"]').should('not.be.disabled');
    cy.get('button').should('not.be.disabled');
  });
});
