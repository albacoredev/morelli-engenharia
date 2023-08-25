import type { IChangeTimeForm } from '$lib/interfaces/forms/changeTime';
import hmsToSeconds from '$lib/utils/hmsToSeconds';
import { create, test, enforce } from 'vest';

const suite = create((data: IChangeTimeForm) => {
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
