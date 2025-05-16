<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import PhotoItem from '$lib/components/PhotoItem.svelte';
	import { downloadPhotos, uploadPhoto } from '$lib/firebase/photos';
	import { ADMIN_ID } from '$lib/firebase/valuations';
	import { EValuationTypesDisplayName, EValuationsRoutes } from '$lib/interfaces/forms/common';
	import type { IHeatForm } from '$lib/interfaces/forms/heat';
	import {
		userStore,
		valuationsHandlers,
		type UserStore,
		photosHandlers,
		photosStore,
		type PhotosStore,
		type ValuationStore,
		valuationStore
	} from '$lib/store';
	import { generatePdf } from '$lib/utils/generatePdf';
	import { onMount } from 'svelte';

	interface ITableRow {
		id: string;
		type: keyof typeof EValuationTypesDisplayName;
		company: string;
		name: string | undefined;
		createdAt: string;
		formData: IHeatForm;
		createdBy: string;
	}

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	let currentValuationStore: ValuationStore = {
		loading: false,
		usersValuations: []
	};

	let currentPhotosStore: PhotosStore = {
		photosUrls: undefined,
		names: undefined,
		loading: true,
		valuationId: ''
	};

	userStore.subscribe((store) => (currentUserStore = store));
	valuationStore.subscribe((store) => (currentValuationStore = store));
	photosStore.subscribe((store) => (currentPhotosStore = store));

	let rows: ITableRow[] = [];
	let valuationsLoading = true;
	let image: HTMLImageElement;
	let input: HTMLInputElement;

	const emailSplit = currentUserStore?.user?.email?.split('@')[0].split('.');
	const nameArray = emailSplit && emailSplit.length > 1 ? emailSplit : ['sem', 'nome'];
	const firstName = nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
	const lastName = nameArray[1].charAt(0).toUpperCase() + nameArray[1].slice(1);
	const technitiansName = `${firstName} ${lastName}`;

	let selectedUser: string | undefined = undefined;
	let filteredRows: ITableRow[] = [];
	let selectedValuation: ITableRow | undefined = undefined;

	const downloadPDF = (form: IHeatForm) => {
		const url = generatePdf(form, technitiansName);

		window.open(url, '_blank');
	};

	const openPhotosDialog = () => {
		window.photoModal.showModal();
		downloadPhotos(selectedValuation?.id ?? '');
	};

	const getPhotosUrls = () => {
		if (!selectedValuation) return;

		photosHandlers.read(selectedValuation.id);
	};

	const onSelectImage = () => {
		const file = input.files?.[0];

		if (!file) return;

		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				image.setAttribute('src', `${reader.result}`);
			});
			reader.readAsDataURL(file);

			return;
		}
	};

	const uploadSelectedImage = () => {
		resetImg();

		let file = input.files?.[0];

		if (!file) return;

		const reader = new FileReader();
		reader.addEventListener('load', () => {
			if (!selectedValuation || !reader.result) return;

			uploadPhoto(`${reader.result}`.split(',')[1], selectedValuation.id);
		});
		reader.readAsDataURL(file);
	};

	const resetImg = () => {
		image.setAttribute('src', '#');
	};

	const updateRows = (user: string | undefined) => {
		if (user === 'TODOS' || user === undefined) {
			filteredRows = rows;
		} else {
			filteredRows = rows.filter((row) => row.createdBy === user);
		}
	};

	onMount(async () => {
		if (!currentUserStore.user) return;

		const valuations = await valuationsHandlers.read(currentUserStore.user.uid);
		valuationsLoading = false;

		rows = valuations
			.map((user) =>
				user.valuations.map((valuation) => ({
					id: valuation.id,
					type: valuation.data.type,
					company: valuation.data.company === '' ? 'Não informado' : valuation.data.company,
					name: valuation.data.name,
					createdAt: valuation.data.date.toDate().toLocaleDateString('pt-BR'),
					formData: valuation.data,
					createdBy: user.email
				}))
			)
			.flat();
	});

	$: selectedValuation && getPhotosUrls();
	$: rows && updateRows(selectedUser);
	$: selectedUser && (selectedValuation = undefined);
</script>

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
		<span class="normal-case text-xl px-4">Avaliações de {technitiansName}</span>
	</div>
</div>

<div class="py-8 flex flex-col gap-4">
	{#if selectedValuation}
		<div class="inline-flex gap-2 w-full justify-center">
			<span>{selectedValuation.createdAt}</span>
			<span>{selectedValuation.company}</span>
			{#if selectedUser !== undefined || selectedUser !== 'TODOS'}
				<span>{selectedValuation.createdBy}</span>
			{/if}
		</div>
	{/if}
	<div class="inline-flex gap-2 w-full justify-center">
		<button
			class="btn btn-primary btn-sm"
			disabled={!selectedValuation}
			on:click={() => selectedValuation && downloadPDF(selectedValuation.formData)}>PDF</button
		>
		<button
			disabled={!selectedValuation}
			class="btn btn-sm btn-primary"
			on:click={() => {
				openPhotosDialog();
			}}>fotos</button
		>
		<a
			href={`avaliacoes/${selectedValuation?.id}/${
				EValuationsRoutes[selectedValuation?.type ?? 'heat']
			}`}
			style={selectedValuation ? 'pointer-events: auto' : 'pointer-events: none'}
			><button class="btn btn-primary btn-sm" disabled={!selectedValuation}>editar</button></a
		>
		{#if currentUserStore.user?.uid === ADMIN_ID}
			<select class="select select-primary select-sm" bind:value={selectedUser}>
				<option selected value="TODOS">TODOS</option>
				{#each currentValuationStore.usersValuations as user}
					<option value={user.email}>{user.email.split('@')[0]}</option>
				{/each}
			</select>
		{/if}
	</div>
</div>

<table class="table w-full table-compact">
	<thead>
		<tr>
			<th />
			{#if selectedUser === 'TODOS'}
				<th>Criado Por</th>
			{/if}
			<th>Tipo</th>
			<th>Empresa</th>
			<th>Criado</th>
			<th>Funcionário</th>
		</tr>
	</thead>
	<tbody>
		{#if valuationsLoading}
			<Loading />
		{:else}
			{#each filteredRows as row}
				<tr class="border-solid border-t-2 border-secondary">
					<td class="border-0"
						><input
							on:change={(e) => {
								if (e.currentTarget.checked) {
									selectedValuation = row;
								}
							}}
							checked={selectedValuation?.id === row.id}
							type="radio"
							name="radio-1"
							class="radio"
						/>
					</td>
					{#if selectedUser === 'TODOS'}
						<td class="border-0">{row.createdBy}</td>
					{/if}
					<td class="border-0">{EValuationTypesDisplayName[row.type]}</td>
					<td class="border-0">{row.company}</td>
					<td class="border-0">{row.createdAt}</td>
					<td class="border-0">{row.name ?? 'Sem Nome'}</td>
				</tr>
			{/each}
		{/if}
	</tbody>
</table>

<dialog id="photoModal" class="bg-transparent w-screen">
	<form method="dialog" class="bg-base-100 p-4 rounded-lg">
		{#if currentPhotosStore.photosUrls && !currentPhotosStore.loading}
			<div class="flex gap-2 mb-4">
				{#if currentPhotosStore.photosUrls.length > 4}
					<div class="tooltip tooltip-open tooltip-error" data-tip="Máximo de 5 fotos">
						<button type="button" class="btn btn-primary btn-disabled"> adcionar fotos </button>
					</div>
				{:else}
					<button
						class="btn btn-primary"
						on:click={() => {
							input.value = '';
							window.uploadPhoto.showModal();
						}}>escolher foto</button
					>
				{/if}
			</div>
			<div class="flex flex-col gap-8">
				{#if currentPhotosStore.photosUrls.length === 0}
					<span>Sem fotos</span>
				{:else}
					{#each currentPhotosStore.photosUrls as url, i}
						<PhotoItem
							src={url}
							valuation={selectedValuation?.id ?? ''}
							name={currentPhotosStore.names?.[i] ?? ''}
						/>
					{/each}
				{/if}
			</div>
		{:else}
			<span>Carregando...</span>
		{/if}
		<div class="modal-action">
			<button class="btn btn-primary">fechar</button>
		</div>
	</form>
</dialog>

<dialog id="uploadPhoto" class="bg-transparent w-screen">
	<form method="dialog" class="bg-base-100 p-4 rounded-lg">
		<label for="photo-input" class="btn btn-primary">Selecionar Imagem</label>
		<input
			id="photo-input"
			type="file"
			name="photo-input"
			accept="image/png, image/jpeg"
			class="invisible h-0"
			bind:this={input}
			on:change={onSelectImage}
		/>
		<img bind:this={image} src="#" alt="Selecione um arquivo" class="w-1/2" />
		<div class="w-100 flex justify-between pt-8">
			<button class="btn btn-primary" on:click={uploadSelectedImage}>enviar</button>
			<button class="btn btn-outline" on:click={resetImg}>cancelar</button>
		</div>
	</form>
</dialog>
