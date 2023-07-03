describe('template spec', () => {
	beforeEach('login', () => {
		cy.visit('http://localhost:5173/');

		cy.intercept(
			'https://firebase.googleapis.com/v1alpha/projects/-/apps/1:76741618291:web:d00e476ec6b78d1ee4d806/webConfig'
		).as('firebase');
		cy.wait('@firebase');

		cy.get('[data-cy="email-input"]').type('gabriel@email.com');
		cy.get('[data-cy="password-input"]').type('123456');

		cy.get('[data-cy="signing-button"]').click();
	});

	it('passes', () => {
		cy.visit('http://localhost:5173/calor');
	});
});

export {};
