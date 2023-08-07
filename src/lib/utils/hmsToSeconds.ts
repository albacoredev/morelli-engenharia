const hmsToSeconds = (time: string) => {
	const pattern = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

	if (!pattern.test(time)) throw new Error('Invalid time format');

	const [hours, minutes, seconds] = time.split(':');
	return +hours * 3600 + +minutes * 60 + +seconds;
};

export default hmsToSeconds;
