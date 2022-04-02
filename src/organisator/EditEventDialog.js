import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function EditEventDialog(props) {
	const {
		open,
		handleClose,
		handleSave,
		handleDelete,
		title = "Unbenannte Veranstaltung",
		description = "",
		file = null,
	} = props;

	const [newTitle, setNewTitle] = useState(title);
	const [newDescription, setNewDescription] = useState(description);
	const [file_, setFile] = useState(file);
	const [localFile, setLocalFile] = useState(null);

	useEffect(() => {
		setNewTitle(title);
		setNewDescription(description);
		setFile(file);
		setLocalFile(null);
	}, [open]);

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const createSaveHandler = () => {
		handleSave(
			newTitle,
			newDescription,
			localFile,
			!Boolean(file) || Boolean(localFile)
		);
	};

	const changeHandler = (event) => {
		setLocalFile(event.target.files[0]);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			fullScreen={!desktop}
			TransitionComponent={Transition}
		>
			{desktop ? (
				<DialogTitle>Veranstaltung anpassen</DialogTitle>
			) : (
				<AppBar position="static">
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant="h6"
							component="div"
						>
							Einstellungen
						</Typography>
						<Button
							autoFocus
							color="inherit"
							onClick={createSaveHandler}
						>
							Speichern
						</Button>
					</Toolbar>
				</AppBar>
			)}
			<DialogContent>
				<Stack direction="column" spacing={2}>
					<TextField
						fullWidth
						variant="standard"
						label="Titel"
						value={newTitle}
						onChange={(e) => {
							setNewTitle(e.target.value);
						}}
					/>

					<TextField
						fullWidth
						multiline
						minRows={4}
						maxRows={8}
						variant="standard"
						value={newDescription}
						label="Beschreibung (optional)"
						placeholder="Bei dieser Veranstaltung geht es um..."
						onChange={(e) => {
							setNewDescription(e.target.value);
						}}
					/>

					<Typography>Dateianhang</Typography>
					<Box>
						<input
							id="selectFile"
							hidden
							type="file"
							name="file"
							onChange={changeHandler}
						/>
						{localFile ? (
							<Box>
								<Button
									size="large"
									sx={{ alignSelf: "flex-start" }}
									color="inherit"
								>
									<Stack
										sx={{ alignItems: "center" }}
										direction="row"
										spacing={1}
									>
										<AttachFileIcon />
										<Stack direction="column">
											<Typography>
												{localFile.name}
											</Typography>
											<Typography variant="caption">{`${Math.trunc(
												localFile.size / 1024 / 1024
											)}MB`}</Typography>
										</Stack>
									</Stack>
								</Button>
								<IconButton
									onClick={() => {
										setLocalFile(null);
									}}
									size="large"
								>
									<DeleteForeverIcon />
								</IconButton>
							</Box>
						) : (
							<Button
								disabled
								disableElevation
								variant="contained"
								startIcon={<AttachFileIcon />}
								onClick={() =>
									document
										.getElementById("selectFile")
										.click()
								}
							>
								Datei auswählen
							</Button>
						)}
					</Box>

					<Typography sx={{ fontWeight: "bold" }}>
						Veranstaltung löschen
					</Typography>
					<Box>
						<Button
							disableElevation
							variant="contained"
							color="error"
							onClick={handleDelete}
						>
							Veranstaltung löschen
						</Button>
					</Box>
				</Stack>
			</DialogContent>
			{desktop && (
				<DialogActions>
					<Button onClick={handleClose}>Abbrechen</Button>
					<Button onClick={createSaveHandler}>Speichern</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default EditEventDialog;
