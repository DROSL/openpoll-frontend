import * as React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function EditEvent() {
	let params = useParams();

	const [redirect, setRedirect] = React.useState(null);
	const [eventDesc, setEventDesc] = React.useState("");
	const [windowWidth, setWindowWidth] = React.useState(
		window.innerWidth > 768 ? "50%" : window.innerWidth - 35
	);
	const [isMobile, setIsMobile] = React.useState(false);
	const [selectedFile, setSelectedFile] = React.useState();
	const [isFilePicked, setIsFilePicked] = React.useState(false);
	const [selectedImage, setSelectedImage] = React.useState();
	const [isImagePicked, setIsImagePicked] = React.useState(false);
	const [changes, setChanges] = React.useState(false);
	const [eventTitle, setEventTitle] = React.useState(null);

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

	const saveAllChanges = () => {
		if (isFilePicked) {
			handleSubmission(selectedFile);
		}
		if (isImagePicked) {
			handleSubmission(selectedImage);
		}

		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: eventTitle,
				description: eventDesc,
				open: true,
			}),
		};

		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.eventId}`,
			requestOptions
		)
			.then((response) => setChanges(false))
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const handleSubmission = (file) => {
		const formData = new FormData();

		formData.append("file", file);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/pdf" },
			body: formData,
		};

		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.eventId}/file`,
			requestOptions
		)
			.then((response) => console.log("Success:", response))
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const handleFocus = (event) => event.target.select();

	const handleBack = () => {
		setRedirect(`/o/event/${params.eventId}`);
	};

	const removeFile = () => {
		setSelectedFile(null);
		setIsFilePicked(false);
	};

	const removeImage = () => {
		setSelectedImage(null);
		setIsImagePicked(false);
	};

	const ButtonShort = React.forwardRef(function Alert(props, ref) {
		return (
			<Button
				sx={{ width: isMobile ? "100%" : "35%", marginTop: "15px" }}
				{...props}
			/>
		);
	});

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? "60%" : windowWidth - 35);
		setIsMobile(windowWidth > 768 ? false : true);
	};

	const getEventMeta = () => {
		const requestOptions = {
			method: "GET",
		};
		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.eventId}`,
			requestOptions
		)
			.then((response) => response.json())
			.then((data) => {
				setEventTitle(data.title);
				if (data.description) setEventDesc(data.description);
			})
			.catch((error) => console.log(error));
	};

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);
		handleResize();
		getEventMeta();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (redirect) {
		return <Navigate to={redirect} eventId={params.eventId} />;
	}

	return (
		<Box sx={{ width: windowWidth, margin: "auto" }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginTop: "15px",
				}}
			>
				<Button size="large" onClick={handleBack} variant="text">
					<ArrowBackIosIcon
						sx={{ color: "primary.main", marginRight: "5px" }}
					/>
					Zurück
				</Button>
			</Box>
			<input
				id="selectFile"
				hidden
				type="file"
				name="file"
				onChange={changeHandler}
			/>
			<input
				id="selectImage"
				hidden
				type="file"
				name="file"
				onChange={changeImageHandler}
			/>
			<TextField
				multiline
				onClick={isMobile ? handleFocus : null}
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
				Datei
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
				<ButtonShort
					onClick={() =>
						document.getElementById("selectFile").click()
					}
					size="large"
					variant="contained"
				>
					+ Datei anhängen
				</ButtonShort>
			)}
			<Typography sx={{ marginTop: "15px", fontWeight: "bold" }}>
				Branding
			</Typography>
			{isImagePicked ? (
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
								<Typography>{selectedImage.name}</Typography>
								<Typography variant="caption">{`${Math.trunc(
									selectedImage.size / 1024 / 1024
								)}MB`}</Typography>
							</Stack>
						</Stack>
					</Button>
					<IconButton onClick={removeImage} size="large">
						<DeleteForeverIcon />
					</IconButton>
				</Box>
			) : (
				<Stack
					spacing={2}
					direction="row"
					sx={{ alignItems: "center" }}
				>
					<ButtonShort
						onClick={() =>
							document.getElementById("selectImage").click()
						}
						size="large"
						variant="contained"
					>
						+ Foto auswählen
					</ButtonShort>
					<Typography>oder</Typography>
					<ButtonShort size="large" variant="contained">
						Text hinzufügen
					</ButtonShort>
				</Stack>
			)}
			{changes ? (
				<ButtonShort
					onClick={saveAllChanges}
					size="large"
					variant="contained"
				>
					Änderungen Speichern
				</ButtonShort>
			) : null}
		</Box>
	);
}

export default EditEvent;
