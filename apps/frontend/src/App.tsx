import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import DeployWithGit from "./components/git_deployment_button";
import DeployWithUpload from "./components/upload_deployment_button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getDeployments,
	startDeploymentWithGit,
} from "./commons/deployment.service";
import DeployItem from "./components/deploy_item";
import { useDeploymentLogs } from "./commons/hooks/log.hook";

interface Build {
	buildId: string;
	buildStatus: string;
	createdAt: string; // Date
}

function App() {
	const queryClient = useQueryClient();

	const [builds, setBuilds] = useState<Build[]>([]);
	const [activeDeploymentId, setActiveDeploymentId] = useState<string | null>(
		null,
	);

	const { logMessages, error } = useDeploymentLogs(activeDeploymentId);

	const deploymentsResponse = useQuery({
		queryKey: ["get_all_deployments"],
		queryFn: () => getDeployments({}),
	});

	useEffect(() => {
		if (
			deploymentsResponse.status === "success" &&
			deploymentsResponse.data.length > 0
		) {
			setActiveDeploymentId(deploymentsResponse.data[0].deploymentId);
		}
	}, [deploymentsResponse.status]);

	const createDeploymentFromGitUrl = useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get_all_deployments"],
				exact: true,
			});
		},
		mutationFn: (arg: any) => {
			return startDeploymentWithGit(arg);
		},
	});

	const logEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Scroll every time the messages array updates
	useEffect(() => {
		scrollToBottom();
	}, [logMessages]);

	const handleViewDeploymentLog = useCallback((deploymentId: string) => {
		console.log(
			`View deployment button clicked, deploymentId: ${deploymentId}`,
		);

		setActiveDeploymentId(deploymentId);
	}, []);

	return (
		<Box padding={10}>
			<Box paddingBottom={10}>
				<DeployWithGit onDeployStart={createDeploymentFromGitUrl} />
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
						{deploymentsResponse.status === "error" && (
							<Text>
								{deploymentsResponse.error?.message ??
									String(deploymentsResponse.error)}
							</Text>
						)}
						{deploymentsResponse.status === "success" &&
							deploymentsResponse.data.map((b) => (
								<DeployItem onViewLog={handleViewDeploymentLog} build={b} />
							))}
					</Box>
				</Box>
				<Box height={45} width="50dvw">
					<Heading size="md">Build #{activeDeploymentId} Logs</Heading>
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
						{logMessages.map((msg) => (
							<Flex direction="row" gap={2} key={msg.messageId}>
								<Text>-</Text>
								{/* <Text className="timestamp">{msg.timestamp}</Text> */}
								<Text className="content">{msg.content}</Text>
							</Flex>
						))}
						<Text>{error}</Text>
						<div ref={logEndRef} />
					</Box>
				</Box>
			</Flex>
		</Box>
	);
}

export default App;
