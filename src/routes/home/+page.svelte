<script lang="ts">
	import { userStore, type UserStore } from '$lib/store';

	let currentUserStore: UserStore = {
		user: null,
		loading: false
	};

	userStore.subscribe((store) => (currentUserStore = store));

	const emailSplit = currentUserStore?.user?.email?.split('@')[0].split('.');
	const nameArray = emailSplit && emailSplit.length > 1 ? emailSplit : ['sem', 'nome'];
	const firstName = nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
	const lastName = nameArray[1].charAt(0).toUpperCase() + nameArray[1].slice(1);
	const technitiansName = `${firstName} ${lastName}`;
	let greeting = '';

	const time = new Date().toLocaleTimeString('pt-BR', {
		hour: '2-digit'
	});

	if (time >= '06' && time < '12') {
		greeting = 'Bom dia';
	} else if (time >= '12' && time < '18') {
		greeting = 'Boa tarde';
	} else if (time >= '18' && time < '25') {
		greeting = 'Boa noite';
	} else {
		greeting = 'Boa noite';
	}

	const signout = async () => {
		const { auth } = await import('$lib/firebase/firebase');

		auth.signOut();
	};
</script>

<div
	class="flex flex-col items-center my-0 mx-auto justify-center gap-8 box-border py-16 w-3/4 md:w-2/4 lg:w-1/4"
>
	<span class="text-base-content font-bold normal-case text-xl">{greeting}, {technitiansName}</span>
	<button class="btn btn-primary btn-sm" on:click={signout}>sair</button>

	<div class="divider py-4">
		<span class="text-lg text-secondary font-bold">Avaliações Quantitativas</span>
	</div>
	<a href="./avaliacoes" class="w-full"
		><button class="btn btn-primary w-full">visualizar minhas avaliações</button></a
	>
	<div class="divider py-4">
		<span class="text-lg text-secondary font-bold">Criar Nova Avaliação Quantitativa</span>
	</div>
	<a href="./nova-avaliacao/calor" class="w-full"
		><button class="btn btn-primary w-full">calor</button></a
	>
	<a href="./nova-avaliacao/ruido" class="w-full"
		><button class="btn btn-primary w-full">ruído</button></a
	>
	<a href="./nova-avaliacao/vibracao" class="w-full"
		><button class="btn btn-primary w-full">vibração</button></a
	>
	<a href="./nova-avaliacao/agentes-quimicos" class="w-full"
		><button class="btn btn-primary w-full">agentes químicos</button></a
	>
</div>
