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
</script>

<div class="form-control w-full py-2">
	{#if type === 'textArea'}
		<textarea
			{placeholder}
			{name}
			class="textarea textarea-bordered textarea-primary w-full"
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
			class="input input-bordered input-primary w-full"
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
