import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig,
} from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const config = defineConfig({
	theme: {
		tokens: {
			colors: {},
		},
	},
});

const system = createSystem(defaultConfig, config);

export const rootRoute = createRootRoute({
	component: () => (
		<ChakraProvider value={system}>
			<Outlet />
			<TanStackRouterDevtools />
		</ChakraProvider>
	),
});
