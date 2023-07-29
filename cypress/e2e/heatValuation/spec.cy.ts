describe('template spec', () => {
	beforeEach('login', () => {
		cy.visit('/');

		cy.get('[data-cy="input-email"]').type('gabriel@email.com');
		cy.get('[data-cy="input-password"]').type('123456');

		cy.get('[data-cy="signing-button"]').click();
	});

	it('passes', () => {
		cy.url().should('include', 'home');
		cy.visit('/calor');

		cy.get('[data-cy*="input"][data-cy-type="text"]').each((el) => cy.wrap(el).type('Teste'));
		cy.get('[data-cy*="input"][data-cy-type="date"]').each((el) => cy.wrap(el).type('01/01/2023'));
		cy.get('[data-cy*="input"][data-cy-type="time"]').each((el, i) =>
			cy.wrap(el).type(`${14 + i}:00:00`)
		);

		cy.get('[data-cy*="radio"]').each((el) => cy.wrap(el).click());

		cy.get('[data-cy="canvas"').each((el) => {
			const canvas = el.get(0) as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');

			if (!ctx) return;

			ctx.moveTo(0, 0);
			ctx.lineTo(440, 160);
			ctx.stroke();
		});

		cy.get('[data-cy="button-submit"]').each((el) => cy.wrap(el).click());

		cy.intercept({
			method: 'GET',
			url: /.*localhost:8080.*/gm
		}).as('firestore');
		cy.wait('@firestore');
	});
});

export {};
