<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$lib/components/Input.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import { userStore, valuationStore, type UserStore, type ValuationStore } from '$lib/store';
	import getTotalTime from '$lib/utils/getTotalTime';
	import suite from '$lib/vestSuites/chemicalAgents';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import SignatureCanvas from '$lib/components/SignatureCanvas.svelte';
	import { SignatureOwner } from '$lib/firebase/signatures';
	import { Timestamp } from 'firebase/firestore';
	import {
		chemicalAgentsLabels,
		EClimaticConditionsOptions,
		EEnviromentOptions,
		EExpositionOptions,
		EVentilationOptions,
		type IChemicalAgentsForm
	} from '$lib/interfaces/forms/chemicalAgents';
	import { page } from '$app/stores';

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));

	let currentValuationStore = {} as ValuationStore;
	valuationStore.subscribe((v) => (currentValuationStore = v));

	const valuationId = $page.url.href.split('/').at(-2);

	const form = currentValuationStore.userValuations.filter((v) => v.id == valuationId)[0]
		.data as unknown as IChemicalAgentsForm;

	const signatures = {
		[SignatureOwner.Evaluated]: form.signatures.evalueted,
		[SignatureOwner.Evaluator]: form.signatures.evaluator
	};

	let createdDate = form.date.toDate().toLocaleDateString('pt-BR');

	let result = suite.get();

	let savingValuation = false;

	onDestroy(() => {
		suite.reset();
	});

	const handleSubmit = async () => {
		if (browser) {
			result = suite(form);

			if (result.hasErrors()) {
				const firstErrorInputName = Object.keys(result.getErrors()).at(-1);
				const element = document.querySelector(`input[name="${firstErrorInputName}"]`);

				if (!element) return;

				element.scrollIntoView({ behavior: 'smooth' });

				return;
			}

			if (!currentUserStore.user) return;

			savingValuation = true;

			const { valuationsHandlers } = await import('$lib/store');

			await valuationsHandlers.update(currentUserStore.user.uid, valuationId ?? '', form);

			await goto('../');
		}
	};

	const calculateTotalTime = (start: string, end: string) => {
		try {
			return getTotalTime(start, end);
		} catch (e) {
			return '00:00:00';
		}
	};

	const updateDate = (date: string) => {
		if (date === '') {
			form.date = '' as unknown as Timestamp;
			return;
		}

		form.date = new Timestamp(new Date(date).getTime() / 1000, 0);
	};

	$: form.totalTime = calculateTotalTime(form.startingTime, form.endingTime);
	$: form.signatures = signatures;
	$: updateDate(createdDate);
</script>

<div class="flex flex-col items-center my-0 mx-auto justify-center">
	<div class="navbar bg-base-100">
		<div class="flex-none">
			<a href="../">
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
			<span class="normal-case text-xl px-4">Editar Avaliação Quantitativa de Agentes Químicos</span
			>
		</div>
	</div>

	<div class="w-full md:w-2/3 lg:w-2/4 p-8">
		<Input
			placeholder={chemicalAgentsLabels.company}
			bind:value={form.company}
			bind:result
			name="company"
		/>
		<Input
			placeholder={chemicalAgentsLabels.date}
			bind:value={createdDate}
			bind:result
			name="date"
			mask="00/00/0000"
			dataCyType="date"
		/>
		<Input
			placeholder={chemicalAgentsLabels.sampleNumber}
			bind:value={form.sampleNumber}
			bind:result
			name="sampleNumber"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Colaborador</span>
		</div>

		<Input placeholder={chemicalAgentsLabels.name} bind:value={form.name} bind:result name="name" />
		<Input
			placeholder={chemicalAgentsLabels.function}
			bind:value={form.function}
			bind:result
			name="function"
		/>
		<Input
			placeholder={chemicalAgentsLabels.sector}
			bind:value={form.sector}
			bind:result
			name="sector"
		/>
		<Input placeholder={chemicalAgentsLabels.ghe} bind:value={form.ghe} bind:result name="ghe" />
		<Input placeholder={chemicalAgentsLabels.epi} bind:value={form.epi} bind:result name="epi" />
		<Input placeholder={chemicalAgentsLabels.epc} bind:value={form.epc} bind:result name="epc" />

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Aparelho e Calibração</span>
		</div>

		<Input
			placeholder={chemicalAgentsLabels.deviceBrand}
			bind:value={form.deviceBrand}
			bind:result
			name="deviceBrand"
		/>
		<Input
			placeholder={chemicalAgentsLabels.deviceModel}
			bind:value={form.deviceModel}
			bind:result
			name="deviceModel"
		/>
		<Input
			placeholder={chemicalAgentsLabels.deviceSerialNumber}
			bind:value={form.deviceSerialNumber}
			bind:result
			name="deviceSerialNumber"
		/>
		<Input
			placeholder={chemicalAgentsLabels.calibrationBrand}
			bind:value={form.calibrationBrand}
			bind:result
			name="calibrationBrand"
		/>
		<Input
			placeholder={chemicalAgentsLabels.calibrationModel}
			bind:value={form.calibrationModel}
			bind:result
			name="calibrationModel"
		/>
		<Input
			placeholder={chemicalAgentsLabels.calibrationSerialNumber}
			bind:value={form.calibrationSerialNumber}
			bind:result
			name="calibrationSerialNumber"
		/>
		<Input
			placeholder={chemicalAgentsLabels.startingCalibration}
			bind:value={form.startingCalibration}
			bind:result
			name="startingCalibration"
		/>
		<Input
			placeholder={chemicalAgentsLabels.endingCalibration}
			bind:value={form.endingCalibration}
			bind:result
			name="endingCalibration"
		/>
		<Input
			placeholder={chemicalAgentsLabels.flowRate}
			bind:value={form.flowRate}
			bind:result
			name="flowRate"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados da Amostragem</span>
		</div>

		<Input
			placeholder={chemicalAgentsLabels.agent}
			bind:value={form.agent}
			bind:result
			name="agent"
		/>
		<Input
			placeholder={chemicalAgentsLabels.sample}
			bind:value={form.sample}
			bind:result
			name="sample"
		/>
		<Input
			placeholder={chemicalAgentsLabels.fieldWhite}
			bind:value={form.fieldWhite}
			bind:result
			name="fieldWhite"
		/>
		<Radio
			options={Object.values(EExpositionOptions)}
			name="exposition"
			label={chemicalAgentsLabels.exposition}
			bind:result
			bind:selected={form.exposition}
		/>
		<Radio
			options={Object.values(EClimaticConditionsOptions)}
			name="climaticConditions"
			label={chemicalAgentsLabels.climaticConditions}
			bind:result
			bind:selected={form.climaticConditions}
		/>
		<Radio
			options={Object.values(EEnviromentOptions)}
			name="enviroment"
			label={chemicalAgentsLabels.enviroment}
			bind:result
			bind:selected={form.enviroment}
		/>
		<Radio
			options={Object.values(EVentilationOptions)}
			name="ventilation"
			label={chemicalAgentsLabels.ventilation}
			bind:result
			bind:selected={form.ventilation}
		/>
		<Input
			placeholder={chemicalAgentsLabels.startingTime}
			bind:value={form.startingTime}
			bind:result
			name="startingTime"
			mask="00:00:00"
			dataCyType="time"
		/>
		<Input
			placeholder={chemicalAgentsLabels.endingTime}
			bind:value={form.endingTime}
			bind:result
			name="endingTime"
			mask="00:00:00"
			dataCyType="time"
		/>
		<Input
			placeholder={chemicalAgentsLabels.totalTime}
			bind:value={form.totalTime}
			bind:result
			name="totalTime"
			disabled
		/>
		<Input
			placeholder={chemicalAgentsLabels.interval}
			bind:value={form.interval}
			bind:result
			name="interval"
			mask="00:00:00"
			dataCyType="time"
		/>
		<Input
			placeholder={chemicalAgentsLabels.activities}
			bind:value={form.activities}
			bind:result
			name="activities"
		/>

		<SignatureCanvas holder={SignatureOwner.Evaluated} bind:value={signatures.evalueted} />
		<SignatureCanvas holder={SignatureOwner.Evaluator} bind:value={signatures.evaluator} />

		<div class="w-full flex justify-center py-8">
			{#if savingValuation}
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
