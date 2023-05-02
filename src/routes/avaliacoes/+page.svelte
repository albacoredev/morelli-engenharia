<script lang="ts">
	import { readValuations } from '$lib/firebase/valuations';
	import type IHeatValuationDoc from '$lib/interfaces/firebase/valuation';
	import { userStore } from '$lib/store';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';

	enum ValuationType {
		heat = 'Calor'
	}

	interface ITableRow {
		type: ValuationType;
		company: string;
		createdAt: string;
		updatedAt: string;
	}

	let currentUser: User | null = null;
	let valuations: ITableRow[] = [];

	onMount(async () => {
		const { auth } = await import('$lib/firebase/firebase');

		userStore(auth).subscribe((user) => {
			currentUser = user;
		});

		if (!currentUser) return;

		const res = await readValuations(currentUser.uid);

		valuations = res.map((doc) => {
			return {
				type: ValuationType[doc.meta.type],
				company: doc.data.company === '' ? 'Não informado' : doc.data.company,
				createdAt: new Date(doc.meta.createdAt.seconds * 1000).toLocaleDateString('pt-BR'),
				updatedAt: new Date(doc.meta.updatedAt.seconds * 1000).toLocaleDateString('pt-BR')
			};
		});
	});
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
		<span class="normal-case text-xl px-4">Avaliações de {currentUser?.displayName}</span>
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
			</tr>
		</thead>
		<tbody>
			{#each valuations as valuation}
				<tr>
					<td>{valuation.type}</td>
					<td>{valuation.company}</td>
					<td>{valuation.createdAt}</td>
					<td>{valuation.updatedAt}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
