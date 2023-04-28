<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
</script>

<div class="flex w-1/3 flex-col items-center my-0 mx-auto gap-8 h-full justify-center">
	<Logo />
	<div class="flex flex-col gap-4 w-full">
		<div class="alert alert-error shadow-lg" class:invisible={true}>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>Error! Task failed successfully.</span>
			</div>
		</div>
		<Input placeholder={'Email'} name={'email'} />
		<Input placeholder={'Senha'} name={'password'} />
		<button class="btn btn-primary">entrar</button>
	</div>
</div>
