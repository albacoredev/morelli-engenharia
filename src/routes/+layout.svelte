<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore, valuationsStore } from '$lib/store';
	import type { User } from 'firebase/auth';
	import { readValuations } from '$lib/firebase/valuations';
	import Loading from '$lib/components/Loading.svelte';

	let user: User | null = null;

	userStore.subscribe((store) => (user = store.user));

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			userStore.update((curr) => ({ ...curr, loading: true }));
			valuationsStore.update((curr) => ({ ...curr, loading: true }));

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
	<Loading />
{/if}
