<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore, type UserStore, authHandlers } from '$lib/store';
	import Loading from '$lib/components/Loading.svelte';
	import { uploadBase64Signature } from '$lib/firebase/signatures';

	let currentUserStore: UserStore;
	let loading: boolean;

	userStore.subscribe((store) => {
		currentUserStore = store;
		loading = store.loading;
	});
	const nonAuthRoutes = ['/'];

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		auth.onAuthStateChanged(async (user) => {
			userStore.update((curr) => ({ ...curr, user, loading: true }));

			const currentPath = window.location.pathname;

			if (user) {
				if (currentPath == '/') await goto('/home');
			} else if (!nonAuthRoutes.includes(currentPath)) {
				await goto('/');
			}

			userStore.update((curr) => ({ ...curr, loading: false }));
		});
	});
</script>

{#if loading}
	<Loading />
{:else}
	<slot />
{/if}
