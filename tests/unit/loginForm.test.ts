import suite from '$lib/vestSuites/signin';
import { describe, expect, it } from 'vitest';

const loginForm = {
	email: '',
	password: ''
};

describe('Validates empty fields', () => {
	it('validates and empty email field', () => {
		const form = { ...loginForm, password: '123456' };

		const result = suite(form);
		const errors = result.getErrors('email');

		expect(errors).toContain('Campo obrigatório');
	});

	it('validates and empty password field', () => {
		const form = { ...loginForm, email: 'foo@bar.com' };

		const result = suite(form);
		const errors = result.getErrors('password');

		expect(errors).toContain('Campo obrigatório');
	});
});

describe('Validates invalid fields', () => {
	it('Validates an invalid email', () => {
		const form = { ...loginForm, email: 'foo', password: '123456' };

		const result = suite(form);
		const errors = result.getErrors('email');

		expect(errors).toContain('Email inválido');
	});
});
