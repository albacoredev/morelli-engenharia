<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { SignatureOwner } from '$lib/firebase/signatures';
	import { type UserStore, userStore } from '$lib/store';
	import getTotalTime from '$lib/utils/getTotalTime';
	import { Timestamp } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import suite from '$lib/vestSuites/vibration';
	import Input from '$lib/components/Input.svelte';
	import SignatureCanvas from '$lib/components/SignatureCanvas.svelte';
	import {
		vibrationLabels,
		type IVibrationForm,
		EConservationOptions,
		EPhysicalStressOptions,
		EWorkerPostureOptions,
		ERoutineActivityOptions
	} from '$lib/interfaces/forms/vibration';
	import Radio from '$lib/components/Radio.svelte';

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));

	const signatures = {
		[SignatureOwner.Evaluated]: '',
		[SignatureOwner.Evaluator]: ''
	};

	let createdDate = '';

	const form = {
		type: 'vibration',
		signatures,
		conservation: '',
		physicalStress: '',
		workerPosture: '',
		routineActivity: ''
	} as unknown as IVibrationForm;

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

			await valuationsHandlers.add(form);

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

	const updateDate = (date: string) => {
		if (date === '') {
			form.date = '' as unknown as Timestamp;
			return;
		}

		form.date = new Timestamp(new Date(date).getTime() / 1000, 0);
	};

	const equipmentOptions = ['Usar Aparelho da Lista', 'Inserir Aparelho Manualmente'];
	let equipmentList: (typeof equipmentOptions)[number] = equipmentOptions[0];
	const resetEquipment = (_: any) => {
		form.brand = '';
		form.model = '';
		form.serialNumber = '';
	};

	$: resetEquipment(equipmentList);
	$: form.totalTime = calculateTotalTime(form.startingTime, form.endingTime);
	$: form.signatures = signatures;
	$: updateDate(createdDate);
</script>

<div class="flex flex-col items-center my-0 mx-auto justify-center">
	<div class="navbar bg-base-100">
		<div class="flex-none">
			<a href="../home">
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
			<span class="normal-case text-xl px-4">Criar Avaliação Quantitativa de Vibração</span>
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

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Colaborador</span>
		</div>

		<Input placeholder={'Nome'} bind:value={form.name} bind:result name="name" />
		<Input placeholder={'Função'} bind:value={form.function} bind:result name="function" />
		<Input placeholder={'Setor'} bind:value={form.sector} bind:result name="sector" />
		<Input placeholder={'GHE'} bind:value={form.ghe} bind:result name="ghe" />

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold"
				>Características das Máquinas/Veículos/Ferramentas/Equipamentos de Trabalho</span
			>
		</div>

		<Input
			placeholder={vibrationLabels.manufacturer}
			bind:value={form.manufacturer}
			bind:result
			name="manufacturer"
		/>
		<Input placeholder={vibrationLabels.year} bind:value={form.year} bind:result name="year" />
		<Radio
			options={Object.values(EConservationOptions)}
			name="conservation"
			label={vibrationLabels.conservation}
			bind:result
			bind:selected={form.conservation}
		/>
		<Input
			placeholder={vibrationLabels.avgSpeed}
			bind:value={form.avgSpeed}
			bind:result
			name="avgSpeed"
		/>
		<Input
			placeholder={vibrationLabels.vibrationLevels}
			bind:value={form.vibrationLevels}
			bind:result
			name="vibrationLevels"
		/>
		<Input
			placeholder={vibrationLabels.transportedCargo}
			bind:value={form.transportedCargo}
			bind:result
			name="transportedCargo"
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados do Aparelho de Medição</span>
		</div>

		<Radio
			options={equipmentOptions}
			name="equipmentList"
			label="Aparelho"
			bind:result
			bind:selected={equipmentList}
		/>

		<div class="form-control w-full py-2">
			<label class="label" for="equipmentBrands">
				<span class="label-text">Selecione a Marca do Aparelho</span>
			</label>
			<select
				class="select select-bordered select-primary w-full"
				disabled={equipmentList == equipmentOptions[1]}
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
				disabled={equipmentList == equipmentOptions[1]}
				name="equipmentBrands"
				bind:value={form.model}
			>
				<option disabled selected>Selecionar</option>
				<option>SmartVib</option>
			</select>
		</div>
		<div class="form-control w-full py-2">
			<label class="label" for="equipmentBrands">
				<span class="label-text">Selecione o Número de Série</span>
			</label>
			<select
				class="select select-bordered select-primary w-full"
				disabled={equipmentList == equipmentOptions[1]}
				name="equipmentBrands"
				bind:value={form.serialNumber}
			>
				<option disabled selected>Selecionar</option>
				<option>734</option>
			</select>
		</div>

		<Input
			placeholder={vibrationLabels.brand}
			bind:value={form.brand}
			bind:result
			name="brand"
			disabled={equipmentList == equipmentOptions[0]}
		/>
		<Input
			placeholder={vibrationLabels.model}
			bind:value={form.model}
			bind:result
			name="model"
			disabled={equipmentList == equipmentOptions[0]}
		/>
		<Input
			placeholder={vibrationLabels.serialNumber}
			bind:value={form.serialNumber}
			bind:result
			name="serialNumber"
			disabled={equipmentList == equipmentOptions[0]}
		/>

		<div class="divider py-4">
			<span class="text-lg text-secondary font-bold">Dados da Amostragem</span>
		</div>

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
		<Radio
			options={Object.values(EPhysicalStressOptions)}
			name="physicalStress"
			label={vibrationLabels.physicalStress}
			bind:result
			bind:selected={form.physicalStress}
		/>
		<Radio
			options={Object.values(EWorkerPostureOptions)}
			name="workerPosture"
			label={vibrationLabels.workerPosture}
			bind:result
			bind:selected={form.workerPosture}
		/>
		<Input
			placeholder={vibrationLabels.surfaceType}
			bind:value={form.surfaceType}
			bind:result
			name="surfaceType"
		/>
		<Input
			placeholder={vibrationLabels.aggravatingCondition}
			bind:value={form.aggravatingCondition}
			bind:result
			name="aggravatingCondition"
		/>
		<Radio
			options={Object.values(ERoutineActivityOptions)}
			name="routineActivity"
			label={vibrationLabels.routineActivity}
			bind:result
			bind:selected={form.routineActivity}
		/>
		<Input
			placeholder={vibrationLabels.estimatedExposureTime}
			bind:value={form.estimatedExposureTime}
			bind:result
			name="estimatedExposureTime"
		/>
		<Input
			placeholder={vibrationLabels.activities}
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
