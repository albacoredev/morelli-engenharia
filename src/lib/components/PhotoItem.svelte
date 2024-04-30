<script lang="ts">
	import { photosHandlers } from '$lib/store';

	export let src: string;
	export let valuation: string;
	export let name: string;

	const downloadPhoto = async () => {
		try {
			const response = await fetch(src);
			const blob = await response.blob();

			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = 'Foto_Avaliacao';

			document.body.appendChild(downloadLink);
			downloadLink.click();

			setTimeout(() => {
				URL.revokeObjectURL(downloadLink.href);
				document.body.removeChild(downloadLink);
			}, 100);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="flex gap-1">
	<img {src} class="w-[100px] h-[100px]" />
	<button
		type="button"
		class="btn btn-square btn-sm btn-primary"
		on:click={() => photosHandlers.delete(valuation, name)}
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
	<button class="btn btn-square btn-sm btn-primary" type="button" on:click={downloadPhoto}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
			/>
		</svg>
	</button>
</div>
