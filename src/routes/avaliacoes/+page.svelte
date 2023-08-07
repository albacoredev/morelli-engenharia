<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import PhotoItem from '$lib/components/PhotoItem.svelte';
	import { downloadPhotos, uploadPhoto } from '$lib/firebase/photos';
	import { EValuationTypesDisplayName } from '$lib/interfaces/forms/common';
	import type { IHeatForm } from '$lib/interfaces/forms/heat';
	import {
		userStore,
		valuationsHandlers,
		type UserStore,
		photosHandlers,
		photosStore,
		type PhotosStore
	} from '$lib/store';
	import { generatePdf } from '$lib/utils/generatePdf';
	import { onMount } from 'svelte';

	interface ITableRow {
		id: string;
		type: keyof typeof EValuationTypesDisplayName;
		company: string;
		createdAt: string;
		formData: IHeatForm;
	}

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));

	let currentPhotosStore: PhotosStore = {
		photosUrls: undefined,
		loading: true,
		valuationId: ''
	};

	photosStore.subscribe((store) => (currentPhotosStore = store));

	let rows: ITableRow[] = [];
	let valuationsLoading = true;

	let userDisplayName = currentUserStore?.user?.email?.split('@')[0] ?? '';

	onMount(async () => {
		if (!currentUserStore.user) return;

		const valuations = await valuationsHandlers.read(currentUserStore.user.uid);
		valuationsLoading = false;

		rows = valuations.map((valuation) => {
			return {
				id: valuation.id,
				type: valuation.data.type,
				company: valuation.data.company === '' ? 'Não informado' : valuation.data.company,
				createdAt: valuation.data.date.toDate().toLocaleDateString('pt-BR'),
				formData: valuation.data
			};
		});
	});

	const downloadPDF = (form: IHeatForm) => {
		const url = generatePdf(form);

		window.open(url, '_blank');
	};

	let currentValuation: string | undefined = undefined;
	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let stream: MediaStream;
	let imageDataUrl = '';

	const openPhotosDialog = (valuationId: string) => {
		currentValuation = valuationId;
		window.photoModal.showModal();
		downloadPhotos(valuationId);
	};

	const startCamera = async () => {
		window.cameraModal.showModal();

		const defaultConstraints: MediaStreamConstraints = {
			video: true,
			audio: false
		};

		const mobileConstraints: MediaStreamConstraints = {
			video: {
				facingMode: {
					exact: 'environment'
				}
			},
			audio: false
		};

		try {
			stream = await navigator.mediaDevices.getUserMedia(mobileConstraints);
		} catch (error) {
			stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
		}

		videoElement.srcObject = stream;
	};

	const viewPhoto = () => {
		window.photoViewModal.showModal();

		canvasElement.width = stream.getTracks()[0].getSettings().width ?? 0;
		canvasElement.height = stream.getTracks()[0].getSettings().height ?? 0;

		canvasElement
			.getContext('2d')
			?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

		imageDataUrl = canvasElement.toDataURL('image/jpeg');
	};

	const uploadTakenPhoto = (id: string | undefined) => {
		if (!currentValuation) return;

		uploadPhoto(imageDataUrl.split(',')[1], id as string);
	};

	const getPhotosUrls = (valuationId: string) => {
		if (!valuationId) return;

		photosHandlers.read(valuationId);
	};

	$: currentValuation && getPhotosUrls(currentValuation);
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
		<span class="normal-case text-xl px-4">Avaliações de {userDisplayName}</span>
	</div>
</div>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Tipo</th>
				<th>Empresa</th>
				<th>Criado</th>
				<th />
				<th />
			</tr>
		</thead>
		<tbody>
			{#if valuationsLoading}
				<Loading />
			{:else}
				{#each rows as row}
					<tr>
						<td>{EValuationTypesDisplayName[row.type]}</td>
						<td>{row.company}</td>
						<td>{row.createdAt}</td>
						<td
							><button
								class="btn btn-primary btn-sm"
								on:click={() => {
									downloadPDF(row.formData);
								}}>PDF</button
							></td
						>
						<td
							><button
								class="btn btn-sm btn-primary"
								on:click={() => {
									openPhotosDialog(row.id);
								}}>fotos</button
							></td
						>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<dialog id="photoModal" class="bg-transparent">
	<form method="dialog" class="bg-base-100 p-4 rounded-lg">
		{#if currentPhotosStore.photosUrls && !currentPhotosStore.loading}
			<div class="flex gap-2 mb-4">
				{#if currentPhotosStore.photosUrls.length > 4}
					<div class="tooltip tooltip-open tooltip-error" data-tip="Máximo de 5 fotos">
						<button type="button" class="btn btn-primary btn-disabled"> adcionar fotos </button>
					</div>
				{:else}
					<button class="btn btn-primary" on:click={startCamera}>tirar foto</button>
				{/if}
			</div>
			<div class="flex flex-col gap-8">
				{#if currentPhotosStore.photosUrls.length === 0}
					<span>Sem fotos</span>
				{:else}
					{#each currentPhotosStore.photosUrls as url}
						<PhotoItem src={url} />
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

<dialog id="cameraModal" class="bg-transparent">
	<form method="dialog" class="bg-base-100 p-4 rounded-lg">
		<video id="video" autoplay bind:this={videoElement} />
		<div class="modal-action">
			<button class="btn btn-primary" on:click={viewPhoto}
				><svg
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
						d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
					/>
				</svg>
			</button>
			<button class="btn btn-primary">fechar</button>
		</div>
	</form>
</dialog>

<dialog id="photoViewModal" class="bg-transparent">
	<form method="dialog" class="bg-base-100 p-4 rounded-lg">
		<canvas bind:this={canvasElement} />
		<div class="modal-action">
			<button class="btn btn-primary" on:click={() => uploadTakenPhoto(currentValuation)}
				>salvar</button
			>
			<button class="btn btn-primary">fechar</button>
		</div>
	</form>
</dialog>
