import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

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

function EditEvent() {
	const { eventId } = useParams();

	const [eventTitle, setEventTitle] = useState(null);
	const [redirect, setRedirect] = useState(null);
	const [eventDesc, setEventDesc] = useState("");

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [selectedImage, setSelectedImage] = useState();
	const [isImagePicked, setIsImagePicked] = useState(false);
	const [changes, setChanges] = useState(false);

	const [openDeleteEventDialog, toggleDeleteEventDialog] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
		setChanges(true);
	};

	const changeImageHandler = (event) => {
		setSelectedImage(event.target.files[0]);
		setIsImagePicked(true);
		setChanges(true);
	};

	const handleClickSave = () => {
		if (isFilePicked) {
			handleSubmission(selectedFile);
		}
		if (isImagePicked) {
			handleSubmission(selectedImage);
		}

		fetch(`/events/${eventId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: eventTitle,
				description: eventDesc,
				open: true,
			}),
		})
			.then((response) => setChanges(false))
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
				console.error("Error:", err);
			});
	};

	const handleClickCancel = () => {
		setRedirect(`/o/event/${eventId}`);
	};

	const removeFile = () => {
		setSelectedFile(null);
		setIsFilePicked(false);
	};

	const getEventMeta = () => {
		fetch(`/events/${eventId}`, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				setEventTitle(data.title);
				if (data.description) setEventDesc(data.description);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getEventMeta();
	}, []);

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
		return <Navigate to={redirect} eventId={eventId} />;
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
						Beenden
					</Button>
				</DialogActions>
			</Dialog>

			<Box padding={3}>
				<input
					id="selectFile"
					hidden
					type="file"
					name="file"
					onChange={changeHandler}
				/>
				<TextField
					multiline
					value={eventDesc}
					sx={{ width: "100%" }}
					id="standard-basic"
					label="Beschreibung"
					variant="standard"
					onChange={(event) => {
						setEventDesc(event.target.value);
						setChanges(true);
					}}
				/>
				<Typography sx={{ marginTop: "15px", fontWeight: "bold" }}>
					Dateianhang
				</Typography>
				{isFilePicked ? (
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
									<Typography>{selectedFile.name}</Typography>
									<Typography variant="caption">{`${Math.trunc(
										selectedFile.size / 1024 / 1024
									)}MB`}</Typography>
								</Stack>
							</Stack>
						</Button>
						<IconButton onClick={removeFile} size="large">
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
				<Button
					size="large"
					onClick={() => toggleDeleteEventDialog(true)}
					variant="contained"
					color="error"
				>
					Veranstaltung löschen
				</Button>

				<Button
					size="large"
					variant="contained"
					color="inherit"
					disableElevation
					onClick={handleClickCancel}
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
			</Box>
		</React.Fragment>
	);
}

export default EditEvent;
