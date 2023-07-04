import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from './firebase/firebase';
import type IHeatValuationDoc from './interfaces/firebase/valuation';

export interface UserStore {
	user: User | null;
	loading: boolean;
}

export interface ValuationsStore {
	valuations: IHeatValuationDoc[];
	loading: boolean;
}

export const userStore = writable<UserStore>({
	user: null,
	loading: false
});

export const valuationsStore = writable<ValuationsStore>({
	valuations: [],
	loading: false
});

export const authHandlers = {
	login: async (email: string, password: string) =>
		await signInWithEmailAndPassword(auth, email, password),
	logout: async () => await signOut(auth)
};
