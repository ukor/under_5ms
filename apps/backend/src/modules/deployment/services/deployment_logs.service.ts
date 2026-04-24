import { spawn } from "node:child_process";

// const command = spawn("ls", ["-lh", "/usr"]);

export async function* lsGenerator() {
	const command = spawn("tree");

	// Stream stdout as events
	for await (const chunk of command.stdout) {
		console.log({ event: "output", data: chunk.toString().trim() });
		yield {
			event: "output",
			data: chunk.toString().trim(),
		};
	}

	// Stream stderr as error events if they occur
	for await (const chunk of command.stderr) {
		console.log({ event: "error", data: chunk.toString().trim() });
		yield {
			event: "error",
			data: chunk.toString().trim(),
		};
	}

	console.log({ event: "end", data: "process finined" });
	// Signal completion
	yield {
		event: "end",
		data: "Process finined",
	};
}

export function killed() {
	// if (!command.killed) {
	// command.kill();
	// }
}
