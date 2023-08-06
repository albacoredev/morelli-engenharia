import type { IHeatForm } from '$lib/interfaces/forms/heat';
import hmsToSeconds from '$lib/utils/hmsToSeconds';
import { create, test, enforce } from 'vest';

const notRequiredFields = ['temperature', 'humidity', 'wind'];

const suite = create((data: IHeatForm) => {
	Object.keys(data).forEach((field) => {
		if (notRequiredFields.includes(field)) return;

		console.log(field);

		test(field, 'Campo obrigatório', () => {
			enforce(data[field as keyof typeof data]).isNotEmpty();
		});
	});

	test('startingTime', 'Horário inválido', () => {
		enforce(data.startingTime).matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
	});

	test('endingTime', 'Horário inválido', () => {
		enforce(data.endingTime).matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
	});

	test('endingTime', 'Horário menor que o inicial', () => {
		enforce(hmsToSeconds(data.endingTime)).greaterThanOrEquals(hmsToSeconds(data.startingTime));
	});
});

export default suite;
