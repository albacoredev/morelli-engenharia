<script lang="ts">
	import { photosHandlers } from '$lib/store';

	export let src: string;
</script>

<div class="flex gap-1">
	<img {src} class="w-[100px] h-[100px]" />
	<button
		type="button"
		class="btn btn-square btn-sm btn-primary"
		on:click={() => photosHandlers.delete(src)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/></svg
		>
	</button>
</div>
