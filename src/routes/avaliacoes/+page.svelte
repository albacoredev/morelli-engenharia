<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import PhotoItem from '$lib/components/PhotoItem.svelte';
	import { ValuationTypesDisplayName, type ValuationTypes } from '$lib/interfaces/forms/common';
	import type IHeatForm from '$lib/interfaces/forms/heat';
	import { HeatFormIndexes } from '$lib/interfaces/forms/heat';
	import { userStore, valuationsHandlers, type UserStore } from '$lib/store';
	import { generatePdf } from '$lib/utils/generatePdf';
	import { onMount } from 'svelte';

	interface ITableRow {
		type: keyof typeof ValuationTypesDisplayName;
		company: string;
		createdAt: string;
		updatedAt: string;
		formData: IHeatForm;
	}

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	let rows: ITableRow[] = [];
	let valuationsLoading = true;

	userStore.subscribe((store) => {
		currentUserStore = store;
	});

	let userDisplayName = currentUserStore?.user?.email?.split('@')[0] ?? '';

	onMount(async () => {
		if (!currentUserStore.user) return;

		const valuations = await valuationsHandlers.read(currentUserStore.user.uid);
		valuationsLoading = false;

		rows = valuations.map((valuation) => {
			return {
				type: valuation.meta.type,
				company:
					valuation.data[HeatFormIndexes.header].fields.company === ''
						? 'Não informado'
						: valuation.data[HeatFormIndexes.header].fields.company,
				createdAt: new Date(valuation.meta.createdAt.seconds * 1000).toLocaleDateString('pt-BR'),
				updatedAt: new Date(valuation.meta.updatedAt.seconds * 1000).toLocaleDateString('pt-BR'),
				formData: valuation.data
			};
		});
	});

	const downloadPDF = (form: IHeatForm, type: string) => {
		const url = generatePdf(form, type as ValuationTypes);

		window.open(url, '_blank');
	};

	const photos = [1, 2, 3, 4, 5];
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
				<th>Atualizado</th>
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
						<td>{ValuationTypesDisplayName[row.type]}</td>
						<!--TODO fallback -->
						<td>{row.company}</td>
						<td>{row.createdAt}</td>
						<td>{row.updatedAt}</td>
						<td
							><button
								class="btn btn-primary btn-sm"
								on:click={() => {
									downloadPDF(row.formData, row.type);
								}}>PDF</button
							></td
						>
						<td
							><button class="btn btn-sm btn-primary" on:click={() => window.photoModal.showModal()}
								>fotos</button
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
		<div class="flex gap-2 mb-4">
			{#if photos.length > 4}
				<div class="tooltip tooltip-open tooltip-error" data-tip="Máximo de 5 fotos">
					<button type="button" class="btn btn-primary btn-disabled"> adcionar fotos </button>
				</div>
			{:else}
				<button type="button" class="btn btn-primary"> adcionar fotos </button>
			{/if}
			<button type="button" class="btn btn-primary" class:btn-disabled={photos.length < 1}>
				baixar fotos
			</button>
		</div>
		{#if photos.length > 0}
			<div class="flex flex-col gap-8">
				<PhotoItem />
				<PhotoItem />
				<PhotoItem />
			</div>
		{:else}
			<span>Sem fotos</span>
		{/if}
		<div class="modal-action">
			<button class="btn btn-primary">fechar</button>
		</div>
	</form>
</dialog>
