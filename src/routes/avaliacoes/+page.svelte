<script lang="ts">
	import { ValuationTypesDisplayName, type ValuationTypes } from '$lib/interfaces/forms/common';
	import type IHeatForm from '$lib/interfaces/forms/heat';
	import { HeatFormIndexes } from '$lib/interfaces/forms/heat';
	import { userStore, valuationsStore, type UserStore, type ValuationsStore } from '$lib/store';
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

	let currentValuationsStore: ValuationsStore = {
		valuations: [],
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));
	valuationsStore.subscribe((store) => (currentValuationsStore = store));

	userStore.subscribe((store) => (currentUserStore = store));

	let valuations = currentValuationsStore.valuations;
	let userDisplayName = currentUserStore.user?.displayName ?? '';
	let rows: ITableRow[] = [];

	onMount(() => {
		if (!currentUserStore.user) return;

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

	const downloadPDF = (form: IHeatForm, author: string, type: string) => {
		const url = generatePdf(form, author, type as ValuationTypes);

		window.open(url, '_blank');
	};
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
		<span class="normal-case text-xl px-4"
			>Avaliações de {currentUserStore.user?.displayName ?? ''}</span
		>
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
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					<td>{ValuationTypesDisplayName[row.type]}</td>
					<!--TODO-->
					<td>{row.company}</td>
					<td>{row.createdAt}</td>
					<td>{row.updatedAt}</td>
					<td
						><button
							class="btn btn-primary btn-sm"
							on:click={() => {
								downloadPDF(row.formData, userDisplayName, row.type);
							}}>PDF</button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
