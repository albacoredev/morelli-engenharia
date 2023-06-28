import { HeatFormIndexes } from '$lib/interfaces/forms/heat';
import type IHeatForm from '$lib/interfaces/forms/heat';
import hmsToSeconds from '$lib/utils/hmsToSeconds';
import { create, test, enforce } from 'vest';

const notRequiredFields = ['temperature', 'humidity', 'wind'];

const suite = create((data: IHeatForm) => {
	data.forEach((section) => {
		const { fields } = section;

		Object.keys(fields).forEach((field) => {
			if (notRequiredFields.includes(field)) return;

			const fieldIndex = field as keyof typeof fields;

			test(field, 'Campo obrigatório', () => {
				enforce(fields[fieldIndex]).isNotEmpty();
			});
		});
	});

	test('startingTime', 'Horário inválido', () => {
		enforce(data[HeatFormIndexes.sampleData].fields.startingTime).matches(
			/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
		);
	});

	test('endingTime', 'Horário inválido', () => {
		enforce(data[HeatFormIndexes.sampleData].fields.endingTime).matches(
			/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
		);
	});

	test('endingTime', 'Horário menor que o inicial', () => {
		enforce(hmsToSeconds(data[HeatFormIndexes.sampleData].fields.endingTime)).greaterThanOrEquals(
			hmsToSeconds(data[HeatFormIndexes.sampleData].fields.startingTime)
		);
	});
});

export default suite;
