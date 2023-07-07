import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from './firebase/firebase';
import { readValuations } from './firebase/valuations';

export interface UserStore {
	user: User | null;
	loading: boolean;
}

export const userStore = writable<UserStore>({
	user: null,
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
