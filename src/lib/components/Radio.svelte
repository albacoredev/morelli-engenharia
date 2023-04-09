<script lang="ts">
	import type { SuiteResult } from 'vest';

	interface RadioProps {
		value: string;
		label: string;
	}

	export let options: RadioProps[];
	export let result: SuiteResult;
	export let validate: (name: string) => void;
	export let name: string;
	export let selected: string;
</script>

<div>
	<span class="label">Choose</span>
	{#if result.getErrors()[name]}
		<span class="label label-text-alt text-error">{result.getErrors()[name][0]}</span>
	{/if}
</div>
{#each options as option}
	<div class="form-control">
		<label class="label cursor-pointer">
			<span class="label-text">{option.label}</span>
			<input
				type="radio"
				{name}
				class="radio radio-primary"
				bind:group={selected}
				value={option.value}
				on:change|self={() => validate(name)}
			/>
		</label>
	</div>
{/each}
