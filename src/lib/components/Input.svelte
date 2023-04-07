<script lang="ts">
	import masked from '$lib/mask';
	import type { SuiteResult } from 'vest';

	export let mask: string | RegExp = '';
	export let placeholder = '';
	export let value: string = '';
	export let name = '';
	export let result: SuiteResult;
	export let validate: (name: string) => void;
</script>

<div class="form-control w-full max-w-xs">
	<input
		type="text"
		{name}
		{placeholder}
		use:masked={mask}
		class="input input-bordered input-primary w-full max-w-xs"
		bind:value
		on:input={() => validate(name)}
	/>
	{#if result.getErrors()[name]}
		<label class="label" for={placeholder}>
			<span class="label-text-alt text-error">{result.getErrors()[name][0]}</span>
		</label>
	{/if}
</div>
