import hmsToSeconds from './hmsToSeconds';

export default function getTotalTime(start: string, end: string) {
	const pattern = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

	if (!pattern.test(start) || !pattern.test(end)) throw new Error('Invalid time format');

	let startingTime = 0;
	let endingTime = 0;

	try {
		startingTime = hmsToSeconds(start);
		endingTime = hmsToSeconds(end);
	} catch (e) {
		throw new Error('Invalid time format');
	}

	if (startingTime > endingTime)
		throw new Error('Starting time cannot be greater than ending time');

	const totalTime = endingTime - startingTime;
	const hours = Math.floor(totalTime / 3600);
	const minutes = Math.floor((totalTime - hours * 3600) / 60);
	const seconds = totalTime - hours * 3600 - minutes * 60;

	return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
		seconds < 10 ? `0${seconds}` : seconds
	}`;
}
