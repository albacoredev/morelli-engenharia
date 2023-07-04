<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore, valuationsStore } from '$lib/store';
	import type { User } from 'firebase/auth';
	import { readValuations } from '$lib/firebase/valuations';

	let user: User | null = null;

	userStore.subscribe((store) => (user = store.user));

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) {
				goto('/');
				return;
			}

			if (user && currentPath == '/') {
				goto('/home');
			}

			if (!user) return;

			const valuations = await readValuations(user.uid);

			userStore.set({ user, loading: false });
			valuationsStore.set({ valuations, loading: false });
		});
	});

	const nonAuthRoutes = ['/'];

	onMount(async () => {});
</script>

{#if user}
	<slot />
{:else}
	loading
{/if}
