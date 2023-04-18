<script lang="ts">
	import masked from '$lib/mask';
	import type { SuiteResult } from 'vest';

	export let mask: string | RegExp = '';
	export let placeholder = '';
	export let value: string = '';
	export let name = '';
	export let result: SuiteResult;
	export let validate: (name: string) => void;
	export let type: 'text' | 'textArea' = 'text';
	export let disabled = false;

	$: error = result.getErrors()[name]?.length > 0;
</script>

<div class="form-control w-full py-2">
	{#if type === 'textArea'}
		<textarea
			{placeholder}
			{name}
			class="textarea textarea-bordered w-full"
			class:textarea-error={error}
			class:textarea-primary={!error}
			bind:value
			on:input={() => validate(name)}
			{disabled}
		/>
	{:else if type === 'text'}
		<input
			type="text"
			{name}
			{placeholder}
			use:masked={mask}
			class="input input-bordered w-full"
			class:input-error={error}
			class:input-primary={!error}
			bind:value
			on:input={() => validate(name)}
			{disabled}
		/>
	{/if}
	{#if result.getErrors()[name]}
		<label class="label" for={placeholder}>
			<span class="label-text-alt text-error">{result.getErrors()[name][0]}</span>
		</label>
	{/if}
</div>
