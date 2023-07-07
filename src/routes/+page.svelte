<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
	import type { AuthError } from 'firebase/auth';
	import suite from '$lib/vestSuites/signin';
	import { goto } from '$app/navigation';

	const form = {
		email: '',
		password: ''
	};

	let firebaseError = '';
	let result = suite.get();

	const validate = (name: string) => {
		result = suite(form, name);
	};

	const signin = async () => {
		result = suite(form);

		if (result.hasErrors()) return;

		if (browser) {
			const { auth } = await import('$lib/firebase/firebase');

			try {
				await signInWithEmailAndPassword(auth, form.email, form.password);

				goto('/home');
			} catch (error) {
				const errorCode = (error as AuthError).code;

				switch (errorCode) {
					case AuthErrorCodes.USER_DELETED:
						firebaseError = 'Email não cadastrado';
						break;
					case AuthErrorCodes.INVALID_EMAIL:
						firebaseError = 'Email inválido';
						break;
					case AuthErrorCodes.INVALID_PASSWORD:
						firebaseError = 'Senha incorreta';
						break;
					default:
						firebaseError = 'Algo deu errado';
						break;
				}
			}
		}
	};
</script>

<div
	class="flex flex-col items-center my-0 mx-auto h-full justify-center gap-8 py-16 w-3/4 md:w-2/4 lg:w-1/4"
>
	<div class="w-2/4">
		<Logo />
	</div>
	<div class="flex flex-col gap-4 w-full">
		<div
			class="transition-opacity alert alert-error shadow-lg"
			class:opacity-0={firebaseError === ''}
			aria-hidden={firebaseError === '' ? 'true' : 'false'}
		>
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
				<span>{firebaseError}</span>
			</div>
		</div>
		<form>
			<Input
				placeholder={'Email'}
				name={'email'}
				bind:value={form.email}
				bind:result
				autocomplete="username"
				dataCy="email-input"
			/>
			<Input
				placeholder={'Senha'}
				name={'password'}
				bind:value={form.password}
				bind:result
				type="password"
				autocomplete="current-password"
				dataCy="password-input"
			/>
		</form>
		<button data-cy="signing-button" class="btn btn-primary" on:click={signin}>entrar</button>
	</div>
</div>
