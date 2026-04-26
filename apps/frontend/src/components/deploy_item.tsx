import type { TriggerDeploymentResponsePayload } from "@aka/shared_types/deployment";
import { Box, Heading, Highlight, Text } from "@chakra-ui/react";
import type { FC } from "react";

interface DeployItemProps {
	build: TriggerDeploymentResponsePayload;
	onViewLog: (deploymentId: string) => void;
}

const DeployItem: FC<DeployItemProps> = ({ build, onViewLog }) => {
	return (
		<Box
			padding={2}
			marginY={2}
			borderRadius="md"
			borderWidth="1px"
			focusRing="mixed"
			data-focus
			style={{ cursor: "pointer" }}
			onClick={() => onViewLog(build.deploymentId)}
		>
			<Heading size="sm">Build #{build.deploymentId}</Heading>
			<Text>
				<Text
				// query={["pending", "building", "deploying", "running", "failed"]}
				// styles={{ px: "0.5", bg: "teal.muted" }}
				>
					Build Status: {build.status}
				</Text>
			</Text>
		</Box>
	);
};

export default DeployItem;
