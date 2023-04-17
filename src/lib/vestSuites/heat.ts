import type IHeatForm from '$lib/interfaces/forms/heat';
import { create, test, enforce, only } from 'vest';

const suite = create((data: IHeatForm, current?: string) => {
	current && only(current);

	test('company', 'Campo obrigatório', () => {
		enforce(data.company).isNotEmpty();
	});

	test('date', 'Campo obrigatório', () => {
		enforce(data.date).isNotEmpty();
	});

	test('sampleNumber', 'Campo obrigatório', () => {
		enforce(data.sampleNumber).isNotEmpty();
	});

	test('valuation', 'Campo obrigatório', () => {
		enforce(data.valuation).isNotEmpty();
	});

	test('methodology', 'Campo obrigatório', () => {
		enforce(data.methodology).isNotEmpty();
	});

	// Dados do Colaborador

	test('name', 'Campo obrigatório', () => {
		enforce(data.name).isNotEmpty();
	});

	test('function', 'Campo obrigatório', () => {
		enforce(data.function).isNotEmpty();
	});

	test('sector', 'Campo obrigatório', () => {
		enforce(data.sector).isNotEmpty();
	});

	test('ghe', 'Campo obrigatório', () => {
		enforce(data.ghe).isNotEmpty();
	});

	test('epi', 'Campo obrigatório', () => {
		enforce(data.epi).isNotEmpty();
	});

	test('epc', 'Campo obrigatório', () => {
		enforce(data.epc).isNotEmpty();
	});

	// Características do Equipamento de Trabalho

	test('brand', 'Campo obrigatório', () => {
		enforce(data.brand).isNotEmpty();
	});

	test('model', 'Campo obrigatório', () => {
		enforce(data.model).isNotEmpty();
	});

	test('serialNumber', 'Campo obrigatório', () => {
		enforce(data.serialNumber).isNotEmpty();
	});

	// Dados da Amostragem

	test('climaticConditions', 'Campo obrigatório', () => {
		enforce(data.climaticConditions).isNotEmpty();
	});

	test('environment', 'Campo obrigatório', () => {
		enforce(data.environment).isNotEmpty();
	});

	test('ventilation', 'Campo obrigatório', () => {
		enforce(data.ventilation).isNotEmpty();
	});

	test('enviromentSolarIncidence', 'Campo obrigatório', () => {
		enforce(data.enviromentSolarIncidence).isNotEmpty();
	});

	test('heatSource', 'Campo obrigatório', () => {
		enforce(data.heatSource).isNotEmpty();
	});

	test('rest', 'Campo obrigatório', () => {
		enforce(data.rest).isNotEmpty();
	});

	test('activities', 'Campo obrigatório', () => {
		enforce(data.activities).isNotEmpty();
	});

	test('startingTime', 'Campo obrigatório', () => {
		enforce(data.startingTime).isNotEmpty();
	});

	test('startingTime', 'Horário inválido', () => {
		enforce(data.startingTime).matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
	});

	test('endingTime', 'Campo obrigatório', () => {
		enforce(data.endingTime).isNotEmpty();
	});

	test('endingTime', 'Horário inválido', () => {
		enforce(data.endingTime).matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
	});

	test('endingTime', 'Horário menor que o inicial', () => {
		enforce(data.endingTime.slice(0, 2)).greaterThanOrEquals(data.startingTime.slice(0, 2));
	});
});

export default suite;
