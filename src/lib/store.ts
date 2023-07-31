import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from './firebase/firebase';
import { downloadPhotos } from './firebase/photos';
import { readValuations } from './firebase/valuations';

export interface UserStore {
	user: User | null;
	loading: boolean;
}

export interface PhotosStore {
	photosUrls: Array<string> | undefined;
	loading: boolean;
}

export const userStore = writable<UserStore>({
	user: null,
	loading: true
});

export const photosStore = writable<PhotosStore>({
	photosUrls: undefined,
	loading: true
});

export const authHandlers = {
	login: async (email: string, password: string) =>
		await signInWithEmailAndPassword(auth, email, password),
	logout: async () => await signOut(auth)
};

export const valuationsHandlers = {
	read: async (uid: string) => await readValuations(uid)
};

export const photosHandlers = {
	read: async (valuationId: string) => await downloadPhotos(valuationId)
};
