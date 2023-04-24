<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$lib/components/Input.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import type IHeatForm from '$lib/interfaces/forms/heat';
	import getTotalTime from '$lib/utils/getTotalTime';
	import suite from '$lib/vestSuites/heat';
	import { Timestamp } from 'firebase/firestore';

	let form: IHeatForm = {
		company: '',
		date: '',
		sampleNumber: '',
		valuation: '',
		methodology: '',
		name: '',
		function: '',
		sector: '',
		ghe: '',
		epi: '',
		epc: '',
		brand: '',
		model: '',
		serialNumber: '',
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
	};

	let result = suite.get();

	const validate = (name?: string) => {
		result = suite(form, name ?? undefined);
	};

	const handleSubmit = async () => {
		if (browser) {
			const { addValuation } = await import('$lib/firebase/valuations');

			addValuation({
				meta: {
					createdAt: Timestamp.fromDate(new Date()),
					updatedAt: Timestamp.fromDate(new Date()),
					createdBy: 'user',
					type: 'heat'
				},
				data: form
			});
		}
	};

	$: form.totalTime = getTotalTime(form.startingTime, form.endingTime);
</script>

<div class="flex items-center flex-col">
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
			<span class="normal-case text-xl px-4">daisyUI</span>
		</div>
	</div>

	<div class="w-2/3 p-8">
		<Input
			placeholder={'Empresa'}
			bind:value={form.company}
			bind:result
			name="company"
			{validate}
		/>
		<Input
			placeholder={'Data'}
			bind:value={form.date}
			bind:result
			name="date"
			{validate}
			mask="00/00/0000"
		/>
		<Input
			placeholder={'Número da Amostragem'}
			bind:value={form.sampleNumber}
			bind:result
			name="sampleNumber"
			{validate}
		/>
		<Radio
			options={['Individual', 'Ambiental']}
			name="valuation"
			label="Avaliação"
			bind:result
			bind:selected={form.valuation}
			{validate}
		/>
		<Radio
			options={['NR-15', 'NHO-06']}
			name="methodology"
			label="Metodologia"
			bind:result
			bind:selected={form.methodology}
			{validate}
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Colaborador</span>
		</div>

		<Input placeholder={'Nome'} bind:value={form.name} bind:result name="name" {validate} />
		<Input
			placeholder={'Função'}
			bind:value={form.function}
			bind:result
			name="function"
			{validate}
		/>
		<Input placeholder={'Setor'} bind:value={form.sector} bind:result name="sector" {validate} />
		<Input placeholder={'GHE'} bind:value={form.ghe} bind:result name="ghe" {validate} />
		<Input
			placeholder={'EPI'}
			bind:value={form.epi}
			bind:result
			name="epi"
			{validate}
			type="textArea"
		/>
		<Input
			placeholder={'EPC'}
			bind:value={form.epc}
			bind:result
			name="epc"
			{validate}
			type="textArea"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold"
				>Características dos Equipamentos de Trabalho</span
			>
		</div>

		<Input placeholder={'Marca'} bind:value={form.brand} bind:result name="brand" {validate} />
		<Input placeholder={'Modelo'} bind:value={form.model} bind:result name="model" {validate} />
		<Input
			placeholder={'Número de Série'}
			bind:value={form.serialNumber}
			bind:result
			name="serialNumber"
			{validate}
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados da Amostragem</span>
		</div>

		<Radio
			options={['Sol', 'Chuva', 'Nublado']}
			name="climaticConditions"
			label="Condições Climáticas"
			bind:result
			bind:selected={form.climaticConditions}
			{validate}
		/>

		<Radio
			options={['Aberto', 'Fechado']}
			name="environment"
			label="Ambiente"
			bind:result
			bind:selected={form.environment}
			{validate}
		/>

		<Radio
			options={['Natural', 'Forçada']}
			name="ventilation"
			label="Ventilação"
			bind:result
			bind:selected={form.ventilation}
			{validate}
		/>

		<Radio
			options={['Interno ou externo sem carga solar', 'Externo com carga solar']}
			name="enviromentSolarIncidence"
			label="Ambiente"
			bind:result
			bind:selected={form.enviromentSolarIncidence}
			{validate}
		/>

		<Input
			placeholder={'Fonte de Calor'}
			bind:value={form.heatSource}
			bind:result
			name="heatSource"
			{validate}
		/>

		<Radio
			options={['No mesmo local', 'Outro ambiente']}
			name="rest"
			label="Descanso"
			bind:result
			bind:selected={form.rest}
			{validate}
		/>

		<Radio
			options={['Leve', 'Moderada', 'Pesada']}
			name="activities"
			label="Atividade"
			bind:result
			bind:selected={form.activities}
			{validate}
		/>

		<Input
			placeholder={'Temperatura'}
			bind:value={form.temperature}
			bind:result
			name="temperature"
			{validate}
		/>

		<Input
			placeholder={'Umidade'}
			bind:value={form.humidity}
			bind:result
			name="humidity"
			{validate}
		/>

		<Input placeholder={'Vento'} bind:value={form.wind} bind:result name="wind" {validate} />

		<Input
			placeholder={'Hora Inicial'}
			bind:value={form.startingTime}
			bind:result
			name="startingTime"
			{validate}
			mask="00:00:00"
		/>

		<Input
			placeholder={'Hora Final'}
			bind:value={form.endingTime}
			bind:result
			name="endingTime"
			{validate}
			mask="00:00:00"
		/>

		<Input
			placeholder={'Tempo'}
			bind:value={form.totalTime}
			bind:result
			name="totalTime"
			{validate}
			disabled
		/>

		<div class="w-full flex justify-center py-8">
			<button class="btn btn-primary w-full max-w-xs" on:click={handleSubmit}>Enviar</button>
		</div>
	</div>
</div>
