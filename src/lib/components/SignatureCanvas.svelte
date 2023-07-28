<script lang="ts">
	import { SignatureOwner } from '$lib/firebase/signatures';
	import SignaturePad from 'signature_pad';
	import { onMount } from 'svelte';

	export let holder: SignatureOwner;

	let canvas: HTMLCanvasElement | null = null;

	$: signPad = canvas ? new SignaturePad(canvas) : null;

	const clearSignPad = () => signPad?.clear();

	function resizeCanvas() {
		if (!canvas) return;

		const ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext('2d')?.scale(ratio, ratio);
		signPad?.clear();
	}

	window.addEventListener('resize', resizeCanvas);

	onMount(resizeCanvas);
</script>

<div class="w-full flex flex-col gap-2 py-4">
	{#if holder == SignatureOwner.Evaluator}
		<span class="label-text">Assinatura do Responsável Técnico Avaliador</span>
	{:else if holder == SignatureOwner.Evaluated}
		<span class="label-text">Assinatura do Colaborador Avaliado</span>
	{/if}
	<canvas
		bind:this={canvas}
		class="bg-white w-full border border-primary rounded-lg h-[160px]"
		id="canvas"
	/>
	<button on:click={clearSignPad} class="btn btn-primary btn-sm">resetar</button>
</div>
