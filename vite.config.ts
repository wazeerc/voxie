import preact from "@preact/preset-vite";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [
			preact({
				prerender: {
					enabled: true,
					renderTarget: "#app",
				},
			}),
		],
		build: {
			target: "esnext",
		},
		optimizeDeps: {
			esbuildOptions: {
				target: "esnext",
			},
		},
		define: {
			"import.meta.env.VITE_ELEVENLABS_API_KEY": JSON.stringify(
				env.VITE_ELEVENLABS_API_KEY,
			),
			"import.meta.env.VITE_ELEVENLABS_VOICE_ID": JSON.stringify(
				env.VITE_ELEVENLABS_VOICE_ID,
			),
		},
	};
});
