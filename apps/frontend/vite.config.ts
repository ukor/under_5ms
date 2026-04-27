import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3013,
		strictPort: true, // Forces Vite to exit if the port is already in use
	},
	plugins: [react()],
});
