const hmsToSeconds = (s: string) => {
	const b = s.split(':');
	return +b[0] * 3600 + +b[1] * 60 + (+b[2] || 0);
};

export default function getTotalTime(start: string, end: string) {
	const error = start.length < 8 || end.length < 8 || start.slice(0, 2) > end.slice(0, 2);

	if (!error) {
		const startingTime = hmsToSeconds(start);
		const endingTime = hmsToSeconds(end);
		const totalTime = endingTime - startingTime;
		const hours = Math.floor(totalTime / 3600);
		const minutes = Math.floor((totalTime - hours * 3600) / 60);
		const seconds = totalTime - hours * 3600 - minutes * 60;

		return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
			seconds < 10 ? `0${seconds}` : seconds
		}`;
	} else {
		return '00:00:00';
	}
}
