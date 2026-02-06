import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), tailwindcss()],
	publicDir: "public",
	base: "./",
	server: {
		proxy: {
			"/__kitledger_data": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/__kitledger_data/, ""),
			},
		}
	}
});
