<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Input from '$lib/components/Input.svelte';
	import { changeTime } from '$lib/firebase/changeTime';
	import type { IChangeTimeForm } from '$lib/interfaces/forms/changeTime';
	import { valuationStore } from '$lib/store';
	import getTotalTime from '$lib/utils/getTotalTime';
	import suite from '$lib/vestSuites/changeTime';

	let result = suite.get();

	const form = {} as IChangeTimeForm;

	const valuationId = $page.url.href.split('/').at(-1);

	let loading = false;

	$: currentValuationStore = $valuationStore.userValuations;

	const formData = currentValuationStore.filter((v) => v.id == valuationId)[0].data;

	const handleSubmit = async () => {
		result = suite(form);

		if (result.hasErrors()) return;

		loading = true;
		await changeTime(valuationId ?? '', form);
		loading = false;
		goto('/avaliacoes');
	};

	const calculateTotalTime = (start: string, end: string) => {
		try {
			return getTotalTime(start, end);
		} catch (e) {
			return '00:00:00';
		}
	};

	$: form.totalTime = calculateTotalTime(form.startingTime, form.endingTime);
</script>

<div class="flex flex-col items-center my-0 mx-auto justify-center">
	<div class="navbar bg-base-100">
		<div class="flex-none">
			<a href="/avaliacoes">
				<button class="btn btn-square btn-ghost">
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						/><g id="SVGRepo_iconCarrier">
							<g id="Arrow / Caret_Left_SM">
								<path
									id="Vector"
									d="M13 15L10 12L13 9"
									stroke="#000000"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</g>
						</g></svg
					>
				</button>
			</a>
		</div>
		<div class="flex-1">
			<span class="normal-case text-xl px-4">Alterar Horário da Avaliação</span>
		</div>
	</div>

	<div class="w-full md:w-2/3 lg:w-2/4 p-8">
		<Input
			placeholder="Hora Inicial"
			bind:value={form.startingTime}
			bind:result
			name="startingTime"
			mask="00:00:00"
			dataCyType="time"
		/>
		<Input
			placeholder="Hora Final"
			bind:value={form.endingTime}
			bind:result
			name="endingTime"
			mask="00:00:00"
			dataCyType="time"
		/>
		<Input
			placeholder="Tempo Total"
			bind:value={form.totalTime}
			bind:result
			name="totalTime"
			disabled
		/>

		<div class="w-full flex justify-center py-8">
			{#if loading}
				<button class="btn btn-primary w-full max-w-xs btn-disabled">carregando</button>
			{:else}
				<button
					class="btn btn-primary w-full max-w-xs"
					data-cy="button-submit"
					on:click={handleSubmit}>Enviar</button
				>
			{/if}
		</div>
	</div>
</div>
