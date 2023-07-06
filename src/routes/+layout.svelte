<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore, valuationsStore, type UserStore, type ValuationsStore } from '$lib/store';
	import { readValuations } from '$lib/firebase/valuations';
	import Loading from '$lib/components/Loading.svelte';

	let currentUserStore: UserStore;
	let currentValuationsStore: ValuationsStore;
	let loading: boolean;

	userStore.subscribe((store) => {
		currentUserStore = store;
		loading = store.loading;
	});
	valuationsStore.subscribe((store) => {
		currentValuationsStore = store;
		loading = store.loading;
	});

	const nonAuthRoutes = ['/'];

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		auth.onAuthStateChanged(async (user) => {
			userStore.update((curr) => ({ ...curr, user, loading: true }));
			valuationsStore.update((curr) => ({ ...curr, loading: true }));

			const currentPath = window.location.pathname;

			const stopLoading = () => {
				userStore.update((curr) => ({ ...curr, loading: false }));
				valuationsStore.update((curr) => ({ ...curr, loading: false }));
			};

			if (user) {
				const valuations = await readValuations(user.uid);
				valuationsStore.update = (curr) => ({ ...curr, valuations });

				if (currentPath == '/') await goto('/home');

				stopLoading();
				return;
			} else if (!nonAuthRoutes.includes(currentPath)) {
				await goto('/');
				stopLoading();
				return;
			}

			stopLoading();
		});
	});
</script>

{#if loading}
	<Loading />
{:else}
	<slot />
{/if}
