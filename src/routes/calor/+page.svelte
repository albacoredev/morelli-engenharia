<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$lib/components/Input.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import type IHeatForm from '$lib/interfaces/forms/heat';
	import { HeatFormIndexes } from '$lib/interfaces/forms/heat';
	import { userStore, type UserStore } from '$lib/store';
	import getTotalTime from '$lib/utils/getTotalTime';
	import suite from '$lib/vestSuites/heat';
	import { goto } from '$app/navigation';
	import { Timestamp } from 'firebase/firestore';

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));

	let form: IHeatForm = [
		{
			name: 'header',
			fields: {
				company: '',
				date: '',
				sampleNumber: '',
				valuation: '',
				methodology: ''
			}
		},
		{
			name: 'employeeData',
			fields: {
				name: '',
				function: '',
				sector: '',
				ghe: '',
				epi: '',
				epc: ''
			}
		},
		{
			name: 'equipmentData',
			fields: {
				brand: '',
				model: '',
				serialNumber: ''
			}
		},
		{
			name: 'sampleData',
			fields: {
				climaticConditions: '',
				environment: '',
				ventilation: '',
				enviromentSolarIncidence: '',
				heatSource: '',
				rest: '',
				activities: '',
				temperature: '',
				humidity: '',
				wind: '',
				startingTime: '',
				endingTime: '',
				totalTime: ''
			}
		}
	];

	let result = suite.get();

	let savingValuation = false;

	const handleSubmit = async () => {
		result = suite(form);

		if (result.hasErrors() || !currentUserStore.user) return;

		if (browser) {
			savingValuation = true;

			const { addValuation } = await import('$lib/firebase/valuations');

			await addValuation({
				meta: {
					createdAt: Timestamp.fromDate(new Date()),
					updatedAt: Timestamp.fromDate(new Date()),
					createdBy: currentUserStore.user.uid,
					type: 'heat'
				},
				data: form
			});

			await goto('../avaliacoes');
		}
	};

	const calculateTotalTime = (start: string, end: string) => {
		try {
			return getTotalTime(start, end);
		} catch (e) {
			return '00:00:00';
		}
	};

	$: form[HeatFormIndexes.sampleData].fields.totalTime = calculateTotalTime(
		form[HeatFormIndexes.sampleData].fields.startingTime,
		form[HeatFormIndexes.sampleData].fields.endingTime
	);
</script>

<div class="flex flex-col items-center my-0 mx-auto justify-center">
	<div class="navbar bg-base-100">
		<div class="flex-none">
			<a href="./home">
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
		<Input
			placeholder={'Empresa'}
			bind:value={form[HeatFormIndexes.header].fields.company}
			bind:result
			name="company"
		/>
		<Input
			placeholder={'Data'}
			bind:value={form[HeatFormIndexes.header].fields.date}
			bind:result
			name="date"
			mask="00/00/0000"
		/>
		<Input
			name="sampleNumber"
			placeholder={'Número da Amostragem'}
			bind:value={form[HeatFormIndexes.header].fields.sampleNumber}
			bind:result
		/>
		<Radio
			options={['Individual', 'Ambiental']}
			name="valuation"
			label="Avaliação"
			bind:result
			bind:selected={form[HeatFormIndexes.header].fields.valuation}
		/>
		<Radio
			options={['NR-15', 'NHO-06']}
			name="methodology"
			label="Metodologia"
			bind:result
			bind:selected={form[HeatFormIndexes.header].fields.methodology}
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Colaborador</span>
		</div>

		<Input
			placeholder={'Nome'}
			bind:value={form[HeatFormIndexes.employeeData].fields.name}
			bind:result
			name="name"
		/>
		<Input
			placeholder={'Função'}
			bind:value={form[HeatFormIndexes.employeeData].fields.function}
			bind:result
			name="function"
		/>
		<Input
			placeholder={'Setor'}
			bind:value={form[HeatFormIndexes.employeeData].fields.sector}
			bind:result
			name="sector"
		/>
		<Input
			placeholder={'GHE'}
			bind:value={form[HeatFormIndexes.employeeData].fields.ghe}
			bind:result
			name="ghe"
		/>
		<Input
			placeholder={'EPI'}
			bind:value={form[HeatFormIndexes.employeeData].fields.epi}
			bind:result
			name="epi"
			type="textArea"
		/>
		<Input
			placeholder={'EPC'}
			bind:value={form[HeatFormIndexes.employeeData].fields.epc}
			bind:result
			name="epc"
			type="textArea"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold"
				>Características dos Equipamentos de Trabalho</span
			>
		</div>

		<Input
			placeholder={'Marca'}
			bind:value={form[HeatFormIndexes.equipmentData].fields.brand}
			bind:result
			name="brand"
		/>
		<Input
			placeholder={'Modelo'}
			bind:value={form[HeatFormIndexes.equipmentData].fields.model}
			bind:result
			name="model"
		/>
		<Input
			placeholder={'Número de Série'}
			bind:value={form[HeatFormIndexes.equipmentData].fields.serialNumber}
			bind:result
			name="serialNumber"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados da Amostragem</span>
		</div>

		<Radio
			options={['Sol', 'Chuva', 'Nublado']}
			name="climaticConditions"
			label="Condições Climáticas"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.climaticConditions}
		/>

		<Radio
			options={['Aberto', 'Fechado']}
			name="environment"
			label="Ambiente"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.environment}
		/>

		<Radio
			options={['Natural', 'Forçada']}
			name="ventilation"
			label="Ventilação"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.ventilation}
		/>

		<Radio
			options={['Interno ou externo sem carga solar', 'Externo com carga solar']}
			name="enviromentSolarIncidence"
			label="Ambiente"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.enviromentSolarIncidence}
		/>

		<Input
			placeholder={'Fonte de Calor'}
			bind:value={form[HeatFormIndexes.sampleData].fields.heatSource}
			bind:result
			name="heatSource"
		/>

		<Radio
			options={['No mesmo local', 'Outro ambiente']}
			name="rest"
			label="Descanso"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.rest}
		/>

		<Radio
			options={['Leve', 'Moderada', 'Pesada']}
			name="activities"
			label="Atividade"
			bind:result
			bind:selected={form[HeatFormIndexes.sampleData].fields.activities}
		/>

		<Input
			placeholder={'Temperatura'}
			bind:value={form[HeatFormIndexes.sampleData].fields.temperature}
			bind:result
			name="temperature"
		/>

		<Input
			placeholder={'Umidade'}
			bind:value={form[HeatFormIndexes.sampleData].fields.humidity}
			bind:result
			name="humidity"
		/>

		<Input
			placeholder={'Vento'}
			bind:value={form[HeatFormIndexes.sampleData].fields.wind}
			bind:result
			name="wind"
		/>

		<Input
			placeholder={'Hora Inicial'}
			bind:value={form[HeatFormIndexes.sampleData].fields.startingTime}
			bind:result
			name="startingTime"
			mask="00:00:00"
		/>

		<Input
			placeholder={'Hora Final'}
			bind:value={form[HeatFormIndexes.sampleData].fields.endingTime}
			bind:result
			name="endingTime"
			mask="00:00:00"
		/>

		<Input
			placeholder={'Tempo'}
			bind:value={form[HeatFormIndexes.sampleData].fields.totalTime}
			bind:result
			name="totalTime"
			disabled
		/>

		<div class="w-full flex justify-center py-8">
			{#if savingValuation}
				<button class="btn btn-primary w-full max-w-xs btn-disabled">carregando</button>
			{:else}
				<button class="btn btn-primary w-full max-w-xs" on:click={handleSubmit}>Enviar</button>
			{/if}
		</div>
	</div>
</div>
