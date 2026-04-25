import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Box, Flex, Heading, Highlight, Text } from "@chakra-ui/react";
import DeployWithGit from "./components/git_deployment_button";
import DeployWithUpload from "./components/upload_deployment_button";

interface Message {
	messageId: string;
	content: string;
	timestamp: string;
}

export interface SSEMessage {
	/**
	 * Event ID for tracking
	 */
	id?: string;

	/**
	 * Event type name
	 */
	event?: string;

	/**
	 * Event data payload
	 */
	data: Message;

	/**
	 * Retry interval in milliseconds
	 */
	retry?: number;
}

function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Create EventSource connection
		const eventSource: EventSource = new EventSource(
			"http://localhost:3012/v1/deployment-logs",
		);

		eventSource.onopen = () => {
			setIsConnected(true);
			setError(null);
		};

		eventSource.onmessage = (event) => {
			try {
				const message: Message = JSON.parse(event.data);
				setMessages((prev) => [...prev, message]);
			} catch (err) {
				console.error("Failed to parse message:", err);
			}
		};

		eventSource.addEventListener("output", (event: MessageEvent<Message>) => {
			console.log(event);
			console.log(event.data);
			setMessages((prev) => [...prev, event.data]);
		});

		eventSource.addEventListener("error", (event: MessageEvent<Message>) => {
			console.log(event);
			console.log(event.data);
			setMessages((prev) => [...prev, event.data]);
		});

		eventSource.addEventListener("end", (event: MessageEvent<Message>) => {
			console.log(event);
			console.log(event.data);
			setMessages((prev) => [...prev, event.data]);

			eventSource.close();
		});

		eventSource.onerror = (event) => {
			// EventSource will automatically reconnect
			setIsConnected(false);
			// Error is set ONLY if connection is completely closed
			if (eventSource.readyState === EventSource.CLOSED) {
				setError("Connection closed. Please refresh the page.");
			}
		};

		// Cleanup on unmount
		return () => {
			eventSource.close();
		};
	}, []);

	const handleClick = useCallback(() => {
		console.log("Button clicked, count is:");
	}, []);

	return (
		<Box padding={10}>
			<Box paddingBottom={10}>
				<DeployWithGit />
				<DeployWithUpload />
			</Box>
			<Flex direction="row" gap="8">
				<Box height={45} width="20dvw">
					<Heading size="md">Builds</Heading>
					<Box
						divideY="2px"
						divideX="0px"
						divideStyle="dashed"
						divideColor="teal.400"
					>
						<Box
							padding={2}
							marginY={2}
							borderRadius="md"
							borderWidth="1px"
							focusRing="mixed"
							data-focus
						>
							<Heading size="sm">Build #112233</Heading>
							<Text>
								<Highlight
									query={[
										"pending",
										"building",
										"deploying",
										"running",
										"failed",
									]}
									styles={{ px: "0.5", bg: "teal.muted" }}
								>
									Build Status: pending
								</Highlight>
							</Text>
						</Box>

						<Box
							padding={2}
							marginY={2}
							borderRadius="md"
							borderWidth="1px"
							focusRing="mixed"
							data-focus
						>
							<Heading size="sm">Build #112233</Heading>
							<Text>
								<Highlight
									query={[
										"pending",
										"building",
										"deploying",
										"running",
										"failed",
									]}
									styles={{ px: "0.5", bg: "teal.muted" }}
								>
									Build Status: pending
								</Highlight>
							</Text>
						</Box>
					</Box>
				</Box>
				<Box height={45} width="50dvw">
					<Heading size="md">Build Logs</Heading>
					<Box
						padding={2}
						width="50dvw"
						height="80dvh"
						borderRadius="md"
						borderWidth="1px"
						focusRing="mixed"
						data-focus
						overflowY="auto"
					>
						{messages.map((msg) => (
							<Flex direction="row" gap={2} key={msg.messageId}>
								<Text className="timestamp">{msg.timestamp}</Text>
								<Text className="content">{msg.content}</Text>
							</Flex>
						))}
						<Text>{error}</Text>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
}

export default App;
