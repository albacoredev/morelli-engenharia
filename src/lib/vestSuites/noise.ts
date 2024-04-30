import type { INoiseForm } from '$lib/interfaces/forms/noise';
import { create, test, enforce } from 'vest';

const suite = create((data: INoiseForm) => {
	['company', 'date'].forEach((field) => {
		test(field, 'Campo obrigatório', () => {
			enforce(data[field as keyof typeof data]).isNotEmpty();
		});
	});
});

export default suite;
