import {
	Button,
	CloseButton,
	Dialog,
	Field,
	Input,
	Portal,
	Text,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";

function DeployWithGit() {
	return (
		<Dialog.Root placement="center" motionPreset="slide-in-bottom">
			<Dialog.Trigger asChild>
				<Button variant="solid">Deploy with Git</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Deploy with Git</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text>Enter a valid Git URL</Text>
							<Field.Root>
								<Field.Label>
									<Field.RequiredIndicator />
								</Field.Label>
								<Input />
								<Field.HelperText />
								<Field.ErrorText />
							</Field.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button>Save</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

export default DeployWithGit;
