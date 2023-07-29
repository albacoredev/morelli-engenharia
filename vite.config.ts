import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ command, mode }) => {
	if (mode === 'development') {
		return {
			plugins: [sveltekit(), basicSsl()],
			test: {
				include: ['./tests/unit/*.{test,spec}.{js,ts}']
			}
		};
	} else {
		return {
			plugins: [sveltekit()],
			test: {
				include: ['./tests/unit/*.{test,spec}.{js,ts}']
			}
		};
	}
});
