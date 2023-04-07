<script lang="ts">
	import suite from '$lib/vestSuites/suite';
	import mask from '$lib/mask';

	console.log(
		suite({
			username: ''
		})
	);
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<button class="btn btn-primary">Button</button>
<input type="text" use:mask={'00.000.000/0000-00'} />
