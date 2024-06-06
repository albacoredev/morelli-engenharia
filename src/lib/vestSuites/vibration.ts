import type { IVibrationForm } from '$lib/interfaces/forms/vibration';
import { create, test, enforce } from 'vest';

const suite = create((data: IVibrationForm) => {
	['company', 'date'].forEach((field) => {
		test(field, 'Campo obrigatório', () => {
			enforce(data[field as keyof typeof data]).isNotEmpty();
		});
	});

	test('date', 'Data Inválida', () => {
		enforce(data.date.seconds).isNotNaN();
	});
});

export default suite;
