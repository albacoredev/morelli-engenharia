import type { Auth } from 'firebase/auth';
import { writable } from 'svelte/store';

export const userStore = (auth: Auth) => {
	let unsubscribe: () => void;

	const { subscribe } = writable(auth.currentUser, (set) => {
		unsubscribe = auth.onAuthStateChanged((user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};
