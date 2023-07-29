import SignaturePad from 'signature_pad';

export const generatePad = (canvas: HTMLCanvasElement) => {
	return new SignaturePad(canvas);
};
