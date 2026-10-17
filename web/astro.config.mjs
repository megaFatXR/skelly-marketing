// @ts-check
import { defineConfig } from 'astro/config';

// On GitHub Pages the deploy workflow sets SITE_URL and BASE_PATH from
// actions/configure-pages, so both <user>.github.io/<repo> and a custom
// domain work without editing this file.
// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'http://localhost:4321',
	base: process.env.BASE_PATH || '/',
});
