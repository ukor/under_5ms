import { createRoute, createRouter } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import App from "./App";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: App,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
