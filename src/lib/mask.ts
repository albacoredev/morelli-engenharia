import IMask from 'imask';

type MaskOptions = IMask.AnyMaskedOptions | string | RegExp;

function createMask(mask: MaskOptions) {
	let options: IMask.AnyMaskedOptions;

	if (typeof mask === 'string') {
		options = { mask };
	} else if (mask instanceof RegExp) {
		options = { mask };
	} else {
		options = mask;
	}

	return IMask.createMask(options);
}

const masked = (node: HTMLInputElement, mask: MaskOptions) => {
	const maskObject = createMask(mask);

	const handleInput = () => {
		if (node && typeof node.select === 'function') {
			node.value = maskObject.resolve(node.value);
		}
	};

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
};

export default masked;
