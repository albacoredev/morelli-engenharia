<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import suite from '$lib/vestSuites/suite';

	let result = suite.get();

	let form = {
		cnpj: '',
		radio: ''
	};

	const validate = (name: string) => {
		result = suite(form, name);
	};
</script>

<Input
	mask={'000.000/0000-00'}
	placeholder={'CNPJ'}
	bind:value={form.cnpj}
	bind:result
	name="cnpj"
	{validate}
/>
<Radio
	options={[
		{ value: 'radio-1', label: 'Radio 1' },
		{ value: 'radio-2', label: 'Radio 2' }
	]}
	name="radio"
	bind:result
	bind:selected={form.radio}
	{validate}
/>

{#each Object.values(form) as value}
	{value} <br />
{/each}
