import type IHeatValuationDoc from '$lib/interfaces/firebase/docs';
import type { IHeatForm } from '$lib/interfaces/forms/heat';
import { userStore, type UserStore } from '$lib/store';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

export const addValuation = async (valuation: IHeatForm) => {
	let currentUserStore: UserStore = {
		loading: true,
		user: null
	};

	userStore.subscribe((store) => (currentUserStore = store));

	if (!currentUserStore.user) {
		throw new Error('Adding a valuation requires authentication');
	}

	const valuationsRef = collection(db, 'technitians', currentUserStore.user.uid, 'valuations');

	const docRef = await addDoc(valuationsRef, valuation);

	console.log('Document written with ID: ', docRef.id);
};

export const readValuations = async (userId: string) => {
	const valuationsRef = collection(db, 'technitians', userId, 'valuations');
	const queryOrder = orderBy('date', 'desc');

	const valuationsQuery = query(valuationsRef, queryOrder);
	const valuationsSnapshot = await getDocs(valuationsQuery);

	const documents = valuationsSnapshot.docs;
	const valuations = documents.map((doc) => ({
		id: doc.id,
		data: { ...doc.data() }
	})) as IHeatValuationDoc[];

	return valuations;
};
