import { create, test, enforce, only } from 'vest';

const suite = create((data = {}, current?: string) => {
	current && only(current);

	test('cnpj', 'CNPJ is required', () => {
		enforce(data.cnpj).isNotBlank();
	});

	test('radio', 'Radio is required', () => {
		enforce(data.radio).isNotBlank();
	});
});

export default suite;
