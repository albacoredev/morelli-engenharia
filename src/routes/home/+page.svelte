<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';

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
</script>

<div class="flex w-1/3 flex-col items-center my-0 mx-auto gap-8 h-full justify-center">
	<Logo />
	<span class="text-base-content font-bold normal-case text-xl">{greeting}, user</span>

	<div class="divider py-4">
		<span class="text-lg text-secondary font-bold">Avaliações Quantitativas</span>
	</div>
	<a href="./avaliacoes" class="w-full"
		><button class="btn btn-primary w-full">visualizar minhas avaliações</button></a
	>
	<div class="divider py-4">
		<span class="text-lg text-secondary font-bold">Criar Nova Avaliação Quantitativa</span>
	</div>
	<a class="w-full" href="./calor"><button class="btn btn-primary w-full">calor</button></a>
	<button class="btn btn-primary w-full">ruído</button>
	<button class="btn btn-primary w-full">vibração</button>
	<button class="btn btn-primary w-full">agentes químicos</button>
</div>
