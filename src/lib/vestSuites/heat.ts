import type IHeatForm from '$lib/interfaces/forms/heat';
import hmsToSeconds from '$lib/utils/hmsToSeconds';
import { create, test, enforce, only } from 'vest';

const requiredFields: (keyof IHeatForm)[] = [
	'company',
	'date',
	'sampleNumber',
	'valuation',
	'methodology',
	'name',
	'function',
	'sector',
	'ghe',
	'epi',
	'epc',
	'brand',
	'model',
	'serialNumber',
	'climaticConditions',
	'environment',
	'ventilation',
	'enviromentSolarIncidence',
	'heatSource',
	'rest',
	'activities',
	'startingTime',
	'endingTime',
	'totalTime'
];

const suite = create((data: IHeatForm, current?: string) => {
	current && only(current);

	requiredFields.forEach((field) => {
		test(field, 'Campo obrigatório', () => {
			enforce(data[field]).isNotEmpty();
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
