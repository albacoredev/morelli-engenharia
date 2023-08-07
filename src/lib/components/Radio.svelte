<script lang="ts">
	import type { SuiteResult } from 'vest';

	export let options: string[];
	export let result: SuiteResult;
	export let name: string;
	export let selected: string;
	export let label: string;

	$: error = result.getErrors()[name]?.length > 0;
</script>

<div class="py-2">
	<div>
		<span class="label font-semibold pt-0">{label}</span>
		{#if result.getErrors()[name]}
			<span class="label label-text-alt text-error" data-cy="span-error-message"
				>{result.getErrors()[name][0]}</span
			>
		{/if}
	</div>
	<div class="form-control gap-2">
		{#each options as option, index}
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					type="radio"
					{name}
					class="radio"
					class:radio-error={error}
					class:radio-primary={!error}
					bind:group={selected}
					value={option}
					data-cy={`radio-${name}`}
					data-cy-radio-index={index}
				/>
				<span class="label-text">{option}</span>
			</label>
		{/each}
	</div>
</div>
