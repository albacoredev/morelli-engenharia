import type IHeatValuationDoc from '$lib/interfaces/firebase/valuation';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

export const addValuation = async (valuation: IHeatValuationDoc) => {
	const valuationsRef = collection(db, 'technitians', valuation.meta.createdBy, 'valuations');

	const docRef = await addDoc(valuationsRef, valuation);

	console.log('Document written with ID: ', docRef.id);
};

export const readValuations = async (userId: string) => {
	const valuationsRef = collection(db, 'technitians', userId, 'valuations');
	const queryOrder = orderBy('meta.createdAt', 'desc');

	const valuationsQuery = query(valuationsRef, queryOrder);
	const valuationsSnapshot = await getDocs(valuationsQuery);

	const documents = valuationsSnapshot.docs;
	const valuations = documents.map((doc) => doc.data()) as IHeatValuationDoc[];

	return valuations;
};
