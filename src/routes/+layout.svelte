<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto('/');
			}
		});
	});
</script>

<button class="btn" on:click={signOut}>Signout</button>
<slot />
