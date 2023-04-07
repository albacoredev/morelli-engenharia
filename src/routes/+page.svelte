<script>
	import Input from '$lib/components/Input.svelte';
	import suite from '$lib/vestSuites/suite';

	let form = {
		cnpj: ''
	};
</script>

<Input mask={'000.000/0000-00'} placeholder={'CNPJ'} bind:form {suite} name="cnpj" />
