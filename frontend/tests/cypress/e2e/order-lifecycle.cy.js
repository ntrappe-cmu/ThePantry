describe('Order lifecycle flows', () => {
  const backendBase = 'http://127.0.0.1:5000';
  const userId = 1;

  const loginBypass = () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('isAuthenticated', 'true');
      },
    });
  };

  const cancelAllActiveHoldsForUser = () => {
    cy.request(`${backendBase}/api/v1/holds?userId=${userId}&active=true`).then((response) => {
      const holds = Array.isArray(response.body) ? response.body : [];

      cy.wrap(holds).each((hold) => {
        cy.request('DELETE', `${backendBase}/api/v1/holds/${hold.id}`);
      });
    });
  };

  beforeEach(() => {
    cancelAllActiveHoldsForUser();
    loginBypass();
    cy.contains('button', 'Request', { timeout: 10000 }).should('be.visible');
  });

  it('requesting a donation removes it from Home and shows it in Orders', () => {
    cy.request(`${backendBase}/api/v1/donations?lat=40.4406&lng=-79.9959&radius=50`).then((response) => {
      const requestedDonationId = response.body[0].id;
      expect(requestedDonationId).to.not.equal('');
      cy.wrap(requestedDonationId).as('requestedDonationId');
    });

    cy.get('.pickup-card').its('length').then((countBefore) => {
      cy.get('.pickup-card').first().within(() => {
        cy.contains('button', 'Request').click();
      });

      cy.get('.pickup-card').should('have.length', countBefore - 1);
    });

    cy.get('@requestedDonationId').then((requestedDonationId) => {
      cy.get('.menu-option-orders').click();
      cy.contains('.pickup-card-wrapper', requestedDonationId, { timeout: 10000 }).should('be.visible');
    });
  });

  it('cancelling an order removes it from Orders and returns it to Home', () => {
    cy.request(`${backendBase}/api/v1/donations?lat=40.4406&lng=-79.9959&radius=50`).then((response) => {
      const requestedDonationId = response.body[0].id;
      expect(requestedDonationId).to.not.equal('');
      cy.wrap(requestedDonationId).as('requestedDonationId');
    });

    cy.get('.pickup-card').first().within(() => {
      cy.contains('button', 'Request').click();
    });

    cy.get('@requestedDonationId').then((requestedDonationId) => {
      cy.get('.menu-option-orders').click();
      cy.contains('.pickup-card-wrapper', requestedDonationId, { timeout: 10000 }).should('be.visible');

      cy.contains('button', 'Cancel').first().click();
      cy.contains('.pickup-card-wrapper', requestedDonationId).should('not.exist');

      cy.get('.menu-option-home').click();

      cy.request(`${backendBase}/api/v1/donations?lat=40.4406&lng=-79.9959&radius=50`).then((response) => {
        const availableIds = response.body.map((donation) => donation.id);
        expect(availableIds).to.include(requestedDonationId);
      });
    });
  });
});
