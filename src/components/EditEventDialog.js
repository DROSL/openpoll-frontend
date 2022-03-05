import React, { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function EditEventDialog() {
	const { eventId } = useParams();

	const [title, setTitle] = useState("Untitled event");
	const [description, setDescription] = useState("");

	const [localFile, setLocalFile] = useState(null);

	const [openDeleteEventDialog, toggleDeleteEventDialog] = useState(false);

	const [redirect, setRedirect] = useState(null);

	const getEvent = () => {
		fetch(`/events/${eventId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setTitle(res.title);
				setDescription(res.description);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getEvent();
	}, []);

	const changeHandler = (event) => {
		setLocalFile(event.target.files[0]);
	};

	const handleClickSave = () => {
		if (localFile) {
			handleSubmission(localFile);
		}

		fetch(`/events/${eventId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: title,
				description: description,
			}),
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleSubmission = (file) => {
		const formData = new FormData();

		formData.append("file", file);

		fetch(`/events/${eventId}/file`, {
			method: "POST",
			headers: { "Content-Type": "application/pdf" },
			body: formData,
		})
			.then((res) => console.log(res))
			.catch((err) => {
				console.log(err);
			});
	};

	const deleteEvent = () => {
		fetch(`/events/${eventId}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (!res.ok) {
					Promise.reject();
				} else {
					setRedirect("/");
				}
			})
			.catch((err) => console.log(err));
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<React.Fragment>
			<Dialog
				open={openDeleteEventDialog}
				onClose={() => toggleDeleteEventDialog(false)}
				maxWidth="xs"
			>
				<DialogTitle>Veranstaltung löschen</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Möchten Sie die Veranstaltung wirklich für alle
						Teilnehmer löschen? Alle gespeicherten Abstimmungen und
						Ergebnisse werden unwiderruflich gelöscht.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => toggleDeleteEventDialog(false)}>
						Abbrechen
					</Button>
					<Button onClick={deleteEvent} autoFocus>
						Endgültig löschen
					</Button>
				</DialogActions>
			</Dialog>

			<Stack direction="column" padding={3} spacing={2}>
				<Typography variant="h6">Veranstaltung anpassen</Typography>

				<TextField
					fullWidth
					variant="outlined"
					label="Titel"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>

				<TextField
					fullWidth
					multiline
					minRows={4}
					maxRows={8}
					variant="outlined"
					value={description}
					label="Beschreibung (optional)"
					placeholder="Bei dieser Veranstaltung geht es um..."
					onChange={(e) => {
						setDescription(e.target.value);
					}}
				/>

				<Typography sx={{ fontWeight: "bold" }}>Dateianhang</Typography>
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
									<Typography>{localFile.name}</Typography>
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
						onClick={() =>
							document.getElementById("selectFile").click()
						}
						size="large"
						variant="contained"
						startIcon={<AttachFileIcon />}
						disableElevation
					>
						Datei auswählen
					</Button>
				)}

				<Typography sx={{ fontWeight: "bold" }}>
					Veranstaltung löschen
				</Typography>
				<Box>
					<Button
						size="large"
						onClick={() => toggleDeleteEventDialog(true)}
						variant="contained"
						color="error"
						disableElevation
					>
						Veranstaltung löschen
					</Button>
				</Box>

				<Stack direction="row" spacing={2}>
					<Button
						component={Link}
						to={`/o/event/${eventId}`}
						size="large"
						variant="contained"
						color="inherit"
						disableElevation
					>
						Abbrechen
					</Button>

					<Button
						size="large"
						variant="contained"
						disableElevation
						onClick={handleClickSave}
					>
						Speichern
					</Button>
				</Stack>
			</Stack>
		</React.Fragment>
	);
}

export default EditEventDialog;
