import { create, test, enforce, only } from 'vest';

const suite = create((data = {}, current?: string) => {
	current && only(current);

	test('cnpj', 'Username is required', () => {
		enforce(data.cnpj).isNotBlank();
	});
});

export default suite;
