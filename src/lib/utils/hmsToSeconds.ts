const hmsToSeconds = (s: string) => {
	const b = s.split(':');
	return +b[0] * 3600 + +b[1] * 60 + (+b[2] || 0);
};

export default hmsToSeconds;
