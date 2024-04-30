import type { IHeatForm } from '$lib/interfaces/forms/heat';
import { create, test, enforce } from 'vest';

const notRequiredFields = ['temperature', 'humidity', 'wind', 'type', 'signatures'];

const suite = create((data: IHeatForm) => {
	['company', 'date'].forEach((field) => {
		if (notRequiredFields.includes(field)) return;

		test(field, 'Campo obrigatório', () => {
			enforce(data[field as keyof typeof data]).isNotEmpty();
		});
	});
});

export default suite;
