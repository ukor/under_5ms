import { spawn } from "node:child_process";

// const command = spawn("ls", ["-lh", "/usr"]);

export const deploymentRegistry = new Map<string, AbortController>();

export function startDeployment(id: string) {
	const controller = new AbortController();
	deploymentRegistry.set(id, controller);
	return controller;
}

export function stopDeployment(id: string) {
	const controller = deploymentRegistry.get(id);
	if (controller) {
		controller.abort();
		deploymentRegistry.delete(id);
		return true;
	}
	return false;
}

export async function* deployer(deploymentId: string, signal: AbortSignal) {
	// Node automatically sends SIGTERM to the process when controller.abort is called
	const command = spawn("ping", ["-c", "100", "localhost"], { signal });

	let messageId = 0;

	try {
		for await (const chunk of command.stdout) {
			messageId++;
			yield {
				id: `${deploymentId}.${messageId}`,
				event: "output",
				data: chunk.toString().trim(),
			};
		}

		// TODO: there is an issue here, stdout will have to finish processing
		// before stderr will ever be handled
		for await (const chunk of command.stderr) {
			messageId++;
			yield {
				id: `${deploymentId}.${messageId}`,
				event: "output",
				data: chunk.toString().trim(),
			};
		}
	} catch (error: any) {
		if (error.name === "AbortError" || error.code === "ABORT_ERR") {
			console.log("Process killed via AbortController signal.");

			return;
		}

		yield {
			id: `${deploymentId}.0`,
			event: "error",
			data: error.toString().trim(),
		};
	} finally {
		if (!command.killed) {
			command.kill();
		}
		if (!signal.aborted) {
			yield {
				id: `${deploymentId}.${messageId + 1}`,
				event: "end",
				data: "Process finished",
			};
		}
	}
}
