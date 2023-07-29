import { ref, uploadString } from 'firebase/storage';
import { storage } from './firebase';

export enum SignatureOwner {
	Evaluator = 'evaluator',
	Evaluated = 'evalueted'
}

export const uploadBase64Signature = async (
	base64: string,
	valuationId: string,
	holder: SignatureOwner
) => {
	const metadata = {
		contentType: 'image/jpeg'
	};

	const storageRef = ref(storage, `signatures/${valuationId}_${holder}`);

	uploadString(storageRef, base64, 'base64', metadata).then((snapshot) =>
		console.log('File uploaded', snapshot)
	);
};
