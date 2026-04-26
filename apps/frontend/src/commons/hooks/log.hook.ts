import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface Message {
	messageId: string;
	content: string;
	timestamp: string;
}

interface UseDeploymentLogsResult {
	setLogMessages: Dispatch<SetStateAction<Message[]>>;
	logMessages: Message[];
	error: string | null;
	isConnected: boolean;
}

export function useDeploymentLogs(
	activeDeploymentId: string | null,
): UseDeploymentLogsResult {
	const [logMessages, setLogMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!activeDeploymentId) {
			setIsConnected(false);
			return;
		}

		setLogMessages([]);
		setError(null);

		const url = `http://localhost:3012/v1/deployment-logs?deploymentId=${activeDeploymentId}`;
		console.log({ url, activeDeploymentId });
		const eventSource: EventSource = new EventSource(url);

		eventSource.onopen = () => {
			setIsConnected(true);
			setError(null);
		};

		eventSource.onmessage = (event) => {
			try {
				const message: Message = JSON.parse(event.data);
				setLogMessages((prev) => [...prev, message]);
			} catch (err) {
				console.error("Failed to parse message:", err);
			}
		};

		eventSource.addEventListener("stdout", (event) => {
			console.log(event);
			console.log(event.data);
			const message: Message = JSON.parse(event.data);
			setLogMessages((prev) => [...prev, message]);
		});

		eventSource.addEventListener("stderr", (event) => {
			console.log(event);
			console.log(event.data);
			const message: Message = JSON.parse(event.data);

			setLogMessages((prev) => [...prev, message]);
		});

		eventSource.addEventListener("end", (event) => {
			console.log(event);
			console.log(event.data);
			const message: Message = JSON.parse(event.data);
			setLogMessages((prev) => [...prev, message]);

			eventSource.close();
		});

		eventSource.onerror = (event) => {
			console.error("eventSource.onError", event);
			// EventSource will automatically reconnect
			setIsConnected(false);
			// Error is set ONLY if connection is completely closed
			if (eventSource.readyState === EventSource.CLOSED) {
				setError("Connection closed. Please refresh the page.");
			}
		};

		return () => {
			eventSource.close();
		};
	}, [activeDeploymentId]);

	return { logMessages, setLogMessages, error, isConnected };
}
