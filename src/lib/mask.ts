import IMask from 'imask';

const cnpjMask = (node: HTMLInputElement, mask: string) => {
	const masked = IMask.createMask({
		mask
	});

	const handleInput = () => {
		if (node && typeof node.select === 'function') {
			node.value = masked.resolve(node.value);
		}
	};

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
};

export default cnpjMask;
