describe('Protected Routes', () => {
	it('Tries to access every protected route with no credentials', () => {
		const protectedRoutes = [
			'/home',
			'nova-avaliacao/calor',
			'nova-avaliacao/ruido',
			'nova-avaliacao/vibracao',
			'/avaliacoes'
		];

		protectedRoutes.forEach((route) => {
			cy.visit(`${route}`);

			cy.url().should('eq', Cypress.config().baseUrl);
		});
	});
});

describe('Login', () => {
	it('Logins with correct credentials', () => {
		cy.visit('/');

		cy.get('[data-cy="input-email"]').type('gabriel@email.com');
		cy.get('[data-cy="input-password"]').type('123456');
		cy.get('[data-cy="signing-button"]').click();

		cy.url().should('include', 'home');
	});

	it('Shows error for wrong email', () => {
		cy.visit('/');

		cy.get('[data-cy="input-email"]').type('wrong@email.com');
		cy.get('[data-cy="input-password"]').type('123456');
		cy.get('[data-cy="signing-button"]').click();

		cy.get(`[data-cy="div-login-error"]`).should('exist');
	});

	it('Shows error for wrong password', () => {
		cy.visit('/');

		cy.get('[data-cy="input-email"]').type('gabriel@email.com');
		cy.get('[data-cy="input-password"]').type('wrong');
		cy.get('[data-cy="signing-button"]').click();

		cy.get(`[data-cy="div-login-error"]`).should('exist');
	});

	it('Shows error for invalid email', () => {
		cy.visit('/');

		cy.get('[data-cy="input-email"]').type('invalid');
		cy.get('[data-cy="input-password"]').type('123456');
		cy.get('[data-cy="signing-button"]').click();

		cy.get('[data-cy="span-error-message"]').should('have.length', 1);
	});

	it('Shows error for empty password and email', () => {
		cy.visit('/');

		cy.get('[data-cy="signing-button"]').click();

		cy.get('[data-cy="span-error-message"]').should('have.length', 2);
	});
});
