import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from './firebase/firebase';
import { deletePhoto, downloadPhotos } from './firebase/photos';
import { addValuation, readValuations, updateValuations } from './firebase/valuations';
import type { IHeatForm } from './interfaces/forms/heat';
import type { INoiseForm } from './interfaces/forms/noise';
import type { IVibrationForm } from './interfaces/forms/vibration';
import type { IChemicalAgentsForm } from './interfaces/forms/chemicalAgents';
import type IHeatValuationDoc from './interfaces/firebase/docs';

export interface UserStore {
	user: User | null;
	loading: boolean;
}

export interface ValuationStore {
	loading: boolean;
	userValuations: IHeatValuationDoc[];
}

export interface PhotosStore {
	photosUrls: Array<string> | undefined;
	loading: boolean;
	valuationId: string;
}

export const userStore = writable<UserStore>({
	user: null,
	loading: true
});

export const photosStore = writable<PhotosStore>({
	photosUrls: undefined,
	loading: true,
	valuationId: ''
});

export const valuationStore = writable<ValuationStore>({
	loading: true,
	userValuations: []
});

export const authHandlers = {
	login: async (email: string, password: string) =>
		await signInWithEmailAndPassword(auth, email, password),
	logout: async () => await signOut(auth)
};

export const valuationsHandlers = {
	add: async (form: IHeatForm | INoiseForm | IVibrationForm | IChemicalAgentsForm) =>
		await addValuation(form),
	read: async (uid: string) => await readValuations(uid),
	update: async (userId: string, valuationId: string, form: object) =>
		await updateValuations(userId, valuationId, form)
};

export const photosHandlers = {
	read: async (valuationId: string) => await downloadPhotos(valuationId),
	['delete']: async (photoUrl: string) => await deletePhoto(photoUrl)
};
