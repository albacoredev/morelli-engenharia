import { create, test, enforce, only } from 'vest';

const suite = create((data = {}, current?: string) => {
	current && only(current);

	test('email', 'Campo obrigatório', () => {
		enforce(data.email).isNotBlank();
	});

	test('email', 'Email inválido', () => {
		enforce(data.email).matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
	});

	test('password', 'Campo obrigatório', () => {
		enforce(data.password).isNotBlank();
	});
});

export default suite;
