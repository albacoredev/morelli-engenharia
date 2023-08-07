import getTotalTime from '$lib/utils/getTotalTime';
import { describe, expect, it } from 'vitest';

describe('Validates starting and ending time', () => {
	it('trhows if a invalid time format is given', () => {
		let startingTime = '10:00:0';
		let endingTime = '11:00:00';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(/^Invalid time format$/);

		startingTime = '09:00:00';
		endingTime = '10:00:0';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(/^Invalid time format$/);

		startingTime = '24:60:60';
		endingTime = '10:00:00';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(/^Invalid time format$/);

		startingTime = '10:00:00';
		endingTime = '24:60:60';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(/^Invalid time format$/);
	});

	it('trhows if the starting time is greater than the ending time', () => {
		let startingTime = '23:59:59';
		let endingTime = '11:00:00';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(
			/^Starting time cannot be greater than ending time$/
		);

		startingTime = '01:00:00';
		endingTime = '00:00:00';

		expect(() => getTotalTime(startingTime, endingTime)).toThrowError(
			/^Starting time cannot be greater than ending time$/
		);
	});
});
