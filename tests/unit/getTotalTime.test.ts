import getTotalTime from '$lib/utils/getTotalTime';
import { describe, expect, it } from 'vitest';

describe('Validates and calculates total time', () => {
	it('calculates total time', () => {
		const startingTime = '14:00:00';
		const endingTime = '15:00:00';

		const totalTime = getTotalTime(startingTime, endingTime);

		expect(totalTime).toBe('01:00:00');
	});

	it('does not calculate an invalid time', () => {
		const startingTime = '99:';
		const endingTime = '14:00';

		const totalTime = getTotalTime(startingTime, endingTime);

		expect(totalTime).toBe('00:00:00');
	});

	it('does not calculate an starting time higher than the ending time', () => {
		const startingTime = '15:00:00';
		const endingTime = '14:00:00';

		const totalTime = getTotalTime(startingTime, endingTime);

		expect(totalTime).toBe('00:00:00');
	});
});
