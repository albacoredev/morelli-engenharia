import hmsToSeconds from '$lib/utils/hmsToSeconds';
import { describe, expect, it } from 'vitest';

describe('Validates time', () => {
	it('throws if an invalid time is provided', () => {
		let time = '00:00:0';

		expect(() => hmsToSeconds(time)).toThrowError(/^Invalid time format$/);

		time = '00:00';

		expect(() => hmsToSeconds(time)).toThrowError(/^Invalid time format$/);

		time = '0';

		expect(() => hmsToSeconds(time)).toThrowError(/^Invalid time format$/);

		time = '24:00:00';

		expect(() => hmsToSeconds(time)).toThrowError(/^Invalid time format$/);

		time = '12:60:00';

		expect(() => hmsToSeconds(time)).toThrowError(/^Invalid time format$/);

		time = '12:00:60';
	});
});

describe('Correctly converts to seconds', () => {
	it('converts hh:mm:ss to seconds correctly', () => {
		let time = '12:00:00';
		let timeInSeconds = 43200;

		let result = hmsToSeconds(time);

		expect(result).toEqual(timeInSeconds);

		time = '00:00:00';
		timeInSeconds = 0;

		result = hmsToSeconds(time);

		expect(result).toEqual(timeInSeconds);

		time = '00:30:00';
		timeInSeconds = 1800;

		result = hmsToSeconds(time);

		expect(result).toEqual(timeInSeconds);

		time = '00:00:30';
		timeInSeconds = 30;

		result = hmsToSeconds(time);

		expect(result).toEqual(timeInSeconds);
	});
});
