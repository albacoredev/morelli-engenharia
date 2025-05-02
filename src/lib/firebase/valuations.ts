import type IHeatValuationDoc from '$lib/interfaces/firebase/docs';
import type { IHeatForm } from '$lib/interfaces/forms/heat';
import type { INoiseForm } from '$lib/interfaces/forms/noise';
import { userStore, valuationStore, type UserStore } from '$lib/store';
import {
	addDoc,
	collection,
	doc,
	FirestoreError,
	getDoc,
	getDocs,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { IVibrationForm } from '$lib/interfaces/forms/vibration';
import type { IChemicalAgentsForm } from '$lib/interfaces/forms/chemicalAgents';

export const addValuation = async (
	valuation: IHeatForm | INoiseForm | IVibrationForm | IChemicalAgentsForm
) => {
	let currentUserStore: UserStore = {
		loading: true,
		user: null
	};

	userStore.subscribe((store) => (currentUserStore = store));

	if (!currentUserStore.user) {
		throw new Error('Adding a valuation requires authentication');
	}

	try {
		const valuationsRef = collection(db, 'technitians', currentUserStore.user.uid, 'valuations');
		await addDoc(valuationsRef, valuation);
	} catch (error) {
		const firestoreError = error as FirestoreError;
		throw new Error(firestoreError.message);
	}
};

export const ADMIN_ID = '2G8P3pCF8zdMgCbtMmoTXYmCeFt1';

export const readValuations = async (userId: string) => {
	const isAdmin = userId === ADMIN_ID;

	const allValuationsRef = collection(db, 'technitians');
	const allValuationsSnapshot = await getDocs(allValuationsRef);

	const technitianRef = doc(db, 'technitians', userId);
	const technitian = (await getDoc(technitianRef)).data();

	let currentUserStore: UserStore = {
		loading: true,
		user: null
	};

	userStore.subscribe((store) => (currentUserStore = store));

	if (technitian && !technitian.email) {
		if (currentUserStore.user?.email) {
			await updateDoc(technitianRef, {
				email: currentUserStore.user.email
			});
		}
	} else if (!technitian) {
		await setDoc(doc(db, 'technitians', userId), { email: currentUserStore.user?.email });
	}

	const getValuations = () =>
		allValuationsSnapshot.docs.map(async (doc) => {
			const valuationsRef = collection(db, 'technitians', doc.id, 'valuations');
			const valuationsSnapshot = await getDocs(valuationsRef);

			const valuations = valuationsSnapshot.docs.map((valuation) => ({
				id: valuation.id,
				data: valuation.data()
			})) as IHeatValuationDoc[];

			return {
				email: doc.data().email,
				valuations
			};
		});

	const getValuationsFromSingleUser = async (userId: string) => {
		const valuationsRef = collection(db, 'technitians', userId, 'valuations');
		const valuationsSnapshot = await getDocs(valuationsRef);
		const emailRef = doc(db, 'technitians', userId);
		const emailSnapshot = await getDoc(emailRef);

		return [
			{
				email: emailSnapshot.data()?.email,
				valuations: valuationsSnapshot.docs.map((valuation) => ({
					id: valuation.id,
					data: valuation.data()
				})) as IHeatValuationDoc[]
			}
		];
	};

	const allValuations = isAdmin
		? await Promise.all(getValuations())
		: await getValuationsFromSingleUser(userId);

	valuationStore.set({ loading: false, usersValuations: allValuations });

	return allValuations;
};

export const updateValuations = async (userId: string, valuationId: string, form: object) => {
	const valuationsRef = doc(db, 'technitians', userId, 'valuations', valuationId);

	await updateDoc(valuationsRef, form);
};
