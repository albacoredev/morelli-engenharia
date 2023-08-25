import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { type UserStore, userStore } from '$lib/store';
import type { IChangeTimeForm } from '$lib/interfaces/forms/changeTime';

export const changeTime = async (id: string, data: IChangeTimeForm) => {
	let currentUserStore: UserStore = {
		loading: true,
		user: null
	};

	userStore.subscribe((store) => (currentUserStore = store));

	if (!currentUserStore.user) {
		throw new Error('Adding a valuation requires authentication');
	}

	const valuationRef = doc(db, 'technitians', currentUserStore.user.uid, 'valuations', id);
	await updateDoc(valuationRef, { ...data });
};
