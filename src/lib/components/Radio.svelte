<script lang="ts">
	import type { SuiteResult } from 'vest';
	import classnames from 'vest/classnames';

	export let options: string[];
	export let result: SuiteResult;
	export let validate: (name: string) => void;
	export let name: string;
	export let selected: string;
	export let label: string;

	$: cn = classnames(result, {
		untested: 'primary',
		valid: 'primary',
		invalid: 'error'
	})(name);
</script>

<div class="py-2">
	<div>
		<span class="label font-semibold pt-0">{label}</span>
		{#if result.getErrors()[name]}
			<span class="label label-text-alt text-error">{result.getErrors()[name][0]}</span>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		{#each options as option}
			<div class="form-control">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="radio"
						{name}
						class={`radio radio-${cn}`}
						bind:group={selected}
						value={option}
						on:change|self={() => validate(name)}
					/>
					<span class="label-text">{option}</span>
				</label>
			</div>
		{/each}
	</div>
</div>
