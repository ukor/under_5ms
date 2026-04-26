import {
	Button,
	CloseButton,
	Dialog,
	FileUpload,
	Portal,
	Text,
} from "@chakra-ui/react";
import type { FC } from "react";
import { HiUpload } from "react-icons/hi";

interface DeployWithUploadProps { }

const DeployWithUpload: FC<DeployWithUploadProps> = () => {
	return (
		<Dialog.Root placement="center" motionPreset="slide-in-bottom">
			<Dialog.Trigger asChild>
				<Button variant="outline">Deploy with upload</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Deploy wit file upload</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text>Upload a directory, you will like to deploy</Text>
							<FileUpload.Root directory>
								<FileUpload.HiddenInput />
								<FileUpload.Trigger asChild>
									<Button variant="outline" size="sm">
										<HiUpload /> Upload file
									</Button>
								</FileUpload.Trigger>
								<FileUpload.List />
							</FileUpload.Root>
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
};

export default DeployWithUpload;
