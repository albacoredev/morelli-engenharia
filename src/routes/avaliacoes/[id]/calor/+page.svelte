<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$lib/components/Input.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import {
		EActivitiesOptions,
		EClimaticConditions,
		EEnviromentOptions,
		EEnviromentSolarIncidenceOptions,
		EMethodologyOptions,
		ERestOptions,
		EValuationOptions,
		EVentilationOptions,
		type IHeatForm
	} from '$lib/interfaces/forms/heat';
	import { userStore, valuationStore, type UserStore, type ValuationStore } from '$lib/store';
	import getTotalTime from '$lib/utils/getTotalTime';
	import suite from '$lib/vestSuites/heat';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import SignatureCanvas from '$lib/components/SignatureCanvas.svelte';
	import { SignatureOwner } from '$lib/firebase/signatures';
	import { Timestamp } from 'firebase/firestore';
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
		.data as unknown as IHeatForm;

	let createdDate = form.date.toDate().toLocaleDateString('pt-BR');

	const signatures = {
		[SignatureOwner.Evaluated]: form.signatures.evalueted,
		[SignatureOwner.Evaluator]: form.signatures.evaluator
	};

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
			<span class="normal-case text-xl px-4">Criar Avaliação Quantitativa de Calor</span>
		</div>
	</div>

	<div class="w-full md:w-2/3 lg:w-2/4 p-8">
		<Input placeholder={'Empresa'} bind:value={form.company} bind:result name="company" />
		<Input
			placeholder={'Data'}
			dataCyType="date"
			bind:value={createdDate}
			bind:result
			name="date"
			mask="00/00/0000"
		/>
		<Input
			name="sampleNumber"
			placeholder={'Número da Amostragem'}
			bind:value={form.sampleNumber}
			bind:result
		/>
		<Radio
			options={Object.values(EValuationOptions)}
			name="valuation"
			label="Avaliação"
			bind:result
			bind:selected={form.valuation}
		/>
		<Radio
			options={Object.values(EMethodologyOptions)}
			name="methodology"
			label="Metodologia"
			bind:result
			bind:selected={form.methodology}
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Colaborador</span>
		</div>

		<Input placeholder={'Nome'} bind:value={form.name} bind:result name="name" />
		<Input placeholder={'Função'} bind:value={form.function} bind:result name="function" />
		<Input placeholder={'Setor'} bind:value={form.sector} bind:result name="sector" />
		<Input placeholder={'GHE'} bind:value={form.ghe} bind:result name="ghe" />
		<Input placeholder={'EPI'} bind:value={form.epi} bind:result name="epi" type="textArea" />
		<Input placeholder={'EPC'} bind:value={form.epc} bind:result name="epc" type="textArea" />
		<Input
			placeholder={'Descrição das Atividades'}
			bind:value={form.activitiesDescription}
			bind:result
			name="activitiesDescription"
			type="textArea"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold"
				>Características dos Equipamentos de Trabalho</span
			>
		</div>

		<div class="form-control w-full py-2">
			<label class="label" for="equipmentBrands">
				<span class="label-text">Selecione a Marca do Aparelho</span>
			</label>
			<select
				class="select select-bordered select-primary w-full"
				name="equipmentBrands"
				bind:value={form.brand}
			>
				<option disabled selected>Selecionar</option>
				<option>CHROMPACK</option>
			</select>
		</div>
		<div class="form-control w-full py-2">
			<label class="label" for="equipmentBrands">
				<span class="label-text">Selecione o Modelo do Aparelho</span>
			</label>
			<select
				class="select select-bordered select-primary w-full"
				name="equipmentBrands"
				bind:value={form.model}
			>
				<option disabled selected>Selecionar</option>
				<option>Net. temp</option>
			</select>
		</div>
		<div class="form-control w-full py-2">
			<label class="label" for="equipmentBrands">
				<span class="label-text">Selecione o Número de Série</span>
			</label>
			<select
				class="select select-bordered select-primary w-full"
				name="equipmentBrands"
				bind:value={form.serialNumber}
			>
				<option disabled selected>Selecionar</option>
				<option>IBU0084</option>
			</select>
		</div>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados da Amostragem</span>
		</div>

		<Radio
			options={Object.values(EClimaticConditions)}
			name="climaticConditions"
			label="Condições Climáticas"
			bind:result
			bind:selected={form.climaticConditions}
		/>

		<Radio
			options={Object.values(EEnviromentOptions)}
			name="environment"
			label="Ambiente"
			bind:result
			bind:selected={form.environment}
		/>

		<Radio
			options={Object.values(EVentilationOptions)}
			name="ventilation"
			label="Ventilação"
			bind:result
			bind:selected={form.ventilation}
		/>

		<Radio
			options={Object.values(EEnviromentSolarIncidenceOptions)}
			name="enviromentSolarIncidence"
			label="Ambiente"
			bind:result
			bind:selected={form.enviromentSolarIncidence}
		/>

		<Input
			placeholder={'Fonte de Calor'}
			bind:value={form.heatSource}
			bind:result
			name="heatSource"
		/>

		<Radio
			options={Object.values(ERestOptions)}
			name="rest"
			label="Descanso"
			bind:result
			bind:selected={form.rest}
		/>

		<Radio
			options={Object.values(EActivitiesOptions)}
			name="activities"
			label="Atividade"
			bind:result
			bind:selected={form.activities}
		/>

		<Input
			placeholder={'Temperatura'}
			bind:value={form.temperature}
			bind:result
			name="temperature"
		/>

		<Input placeholder={'Umidade'} bind:value={form.humidity} bind:result name="humidity" />

		<Input placeholder={'Vento'} bind:value={form.wind} bind:result name="wind" />

		<Input
			placeholder={'Hora Inicial'}
			dataCyType="time"
			bind:value={form.startingTime}
			bind:result
			name="startingTime"
			mask="00:00:00"
		/>

		<Input
			placeholder={'Hora Final'}
			dataCyType="time"
			bind:value={form.endingTime}
			bind:result
			name="endingTime"
			mask="00:00:00"
		/>

		<Input
			placeholder={'Tempo'}
			bind:value={form.totalTime}
			bind:result
			name="totalTime"
			disabled
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
