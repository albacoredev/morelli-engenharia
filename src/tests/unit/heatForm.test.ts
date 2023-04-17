import { describe, it, expect } from 'vitest';

import suite from '$lib/vestSuites/heat';
import type IHeatForm from '$lib/interfaces/forms/heat';
import getTotalTime from '$lib/utils/getTotalTime';

const form: IHeatForm = {
	company: '',
	date: '',
	sampleNumber: '',
	valuation: '',
	methodology: '',
	name: '',
	function: '',
	sector: '',
	ghe: '',
	epi: '',
	epc: '',
	brand: '',
	model: '',
	serialNumber: '',
	climaticConditions: '',
	environment: '',
	ventilation: '',
	enviromentSolarIncidence: '',
	heatSource: '',
	rest: '',
	activities: '',
	temperature: '',
	humidity: '',
	wind: '',
	startingTime: '',
	endingTime: '',
	totalTime: ''
};

describe('Validates empty fields', () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { temperature, humidity, wind, totalTime, ...requieredFields } = form;

	for (const field in requieredFields) {
		it(`validates an empty ${field} field`, () => {
			expect(suite(form).getErrors()[field]).toContain('Campo obrigatório');
		});
	}
});

describe('Validates starting and ending time', () => {
	it('validates an invalid starting time', () => {
		expect(suite({ ...form, startingTime: '99:99:99' }).getErrors()['startingTime']).toContain(
			'Horário inválido'
		);
	});

	it('validates an invalid ending time', () => {
		expect(suite({ ...form, endingTime: '99:99:99' }).getErrors()['endingTime']).toContain(
			'Horário inválido'
		);
	});

	it('calculates total time', () => {
		expect(getTotalTime('13:00:00', '14:00:00')).toBe('01:00:00');
	});

	it('does not calculate an invalid time', () => {
		expect(getTotalTime('99:', '14:00')).toBe('00:00:00');
	});

	it('does not calculate an starting time higher than the ending time', () => {
		expect(getTotalTime('18:00:00', '14:00:00')).toBe('00:00:00');
	});
});
