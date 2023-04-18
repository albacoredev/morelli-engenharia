import type IHeatValuationDoc from '$lib/interfaces/firebase/valuation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const addValuation = async (valuation: IHeatValuationDoc) => {
	const docRef = await addDoc(collection(db, 'technitians', 'mockuserid', 'valuations'), valuation);

	console.log('Document written with ID: ', docRef.id);
};
