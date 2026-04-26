import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

import {
	gitDeploymentSteps,
	zipDeploymentSteps,
} from "../dummies/deployment_steps.dummy.js";
import { createHash } from "node:crypto";

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

export async function* gitDeploymentSimulation(gitUrl: string) {
	// ---

	const deploymentId = createHash("sha256")
		.update(gitUrl + Date.now())
		.digest("hex");

	let messageId = 0;
	for (const step of gitDeploymentSteps) {
		messageId++;
		const randomNumber = Math.floor(Math.random() * 2000) + 1;
		await setTimeout(1000 + randomNumber + messageId);
		yield {
			id: `${deploymentId}.${messageId}`,
			event: "stdout",
			data: {
				messageId: `${deploymentId}.${messageId}`,
				content: step,
				timestamp: new Date(),
			},
		};
	}

	yield {
		id: `${deploymentId}.${messageId + 1}`,
		event: "end",
		data: {
			messageId: `${deploymentId}.${messageId + 1}`,
			content: "Processed finished",
			timestamp: new Date(),
		},
	};
}

export async function* fileUploadDeploymentSimulation(gitUrl: string) {
	// ---

	const deploymentId = createHash("sha256")
		.update(gitUrl + Date.now())
		.digest("hex");

	let messageId = 0;
	for (const step of zipDeploymentSteps) {
		messageId++;
		const randomNumber = Math.floor(Math.random() * 2000) + 1;
		await setTimeout(1000 + randomNumber + messageId);
		yield {
			id: `${deploymentId}.${messageId}`,
			event: "stdout",
			data: {
				messageId: `${deploymentId}.${messageId}`,
				content: step,
				timestamp: new Date(),
			},
		};
	}

	yield {
		id: `${deploymentId}.${messageId + 1}`,
		event: "end",
		data: {
			messageId: `${deploymentId}.${messageId + 1}`,
			content: "Processed finished",
			timestamp: new Date(),
		},
	};
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
				event: "stdout",
				data: {
					messageId: `${deploymentId}.${messageId}`,
					content: chunk.toString().trim(),
					timestamp: new Date(),
				},
			};
		}

		// TODO: there is an issue here, stdout will have to finish processing
		// before stderr will ever be handled
		for await (const chunk of command.stderr) {
			messageId++;
			yield {
				id: `${deploymentId}.${messageId}`,
				event: "stderr",
				data: {
					messageId: `${deploymentId}.${messageId}`,
					content: chunk.toString().trim(),
					timestamp: new Date(),
				},
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
			data: {
				messageId: `${deploymentId}.0`,
				content: error.toString().trim(),
				timestamp: new Date(),
			},
		};
	} finally {
		if (!command.killed) {
			command.kill();
		}
		if (!signal.aborted) {
			yield {
				id: `${deploymentId}.${messageId + 1}`,
				event: "end",
				data: {
					messageId: `${deploymentId}.${messageId + 1}`,
					content: "Processed finished",
					timestamp: new Date(),
				},
			};
		}
	}
}
