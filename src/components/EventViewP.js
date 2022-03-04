import * as React from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { io } from "socket.io-client";

function EventViewP(props) {
	const [open, setOpen] = React.useState(false);
	const [openLeave, setOpenLeave] = React.useState(false);
	const [redirect, setRedirect] = React.useState(null);
	const [windowWidth, setWindowWidth] = React.useState(
		window.innerWidth > 768 ? "50%" : window.innerWidth - 35
	);
	const [eventTitle, setEventTitle] = React.useState(
		"Titel der Veranstaltung"
	);
	const [eventDesc, setEventDesc] = React.useState(
		"Beschreibung der Veranstaltung"
	);
	const [eventFile, setEventFile] = React.useState(null);
	const [eventImage, setEventImage] = React.useState(null);
	const [pollTitle, setPollTitle] = React.useState(null);
	const [pollId, setPollId] = React.useState(null);
	const [pollActive, setPollActive] = React.useState(false);

	const handleClose = () => {
		setOpenLeave(false);
		setOpen(false);
	};

	const handleVote = () => {
		setOpen(false);
		if (pollId != null)
			setRedirect(`/p/event/${params.eventId}/poll/${pollId}`);
		else {
			console.log("No active Poll");
		}
	};

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? "60%" : windowWidth - 35);
	};

	const setMeta = (data) => {
		setEventTitle(data.title);
		setEventDesc(data.description);
		setEventFile(data.file);
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
			.then((data) => setMeta(data))
			.catch((error) => console.log(error));
	};

	const socketListeners = () => {
		console.log("Listening");
		const socket = io();
		socket.on("event-delete", (code) => {
			console.log("EVENT DELETED");
			setRedirect("/");
		});

		socket.on("poll-start", (code, poll_id, poll_title) => {
			setPollTitle(poll_title);
			setPollId(poll_id);
			setPollActive(true);
			setOpen(true);
		});
	};

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);

		getEventMeta();
		socketListeners();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	let params = useParams();

	if (redirect) {
		return <Navigate to={redirect} eventId={params.eventId} />;
	}
	return (
		<React.Fragment>
			<Box
				sx={{
					width: windowWidth,
					margin: "auto",
					marginTop: "25px",
					flexDirection: "column",
					display: "flex",
					alignItems: "center",
				}}
			>
				<Box>
					<Typography variant="h4" component="h1">
						{eventTitle}
					</Typography>
					<Typography
						sx={{
							margin: "5px",
						}}
					>
						{eventDesc}
					</Typography>
					{eventFile ? (
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
									<Typography>ablauf-2020.pdf</Typography>
									<Typography variant="caption">
										2 MB
									</Typography>
								</Stack>
								<IconButton size="large" color="primary">
									<DownloadIcon />
								</IconButton>
							</Stack>
						</Button>
					) : null}
					{pollActive ? (
						<Stack
							spacing={2}
							direction="column"
							sx={{
								margin: "auto",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Button
								size="large"
								sx={{ width: "80%", marginTop: "10px" }}
								onClick={handleVote}
								variant="contained"
							>
								An Abstimmung teilnehmen
							</Button>
						</Stack>
					) : null}
				</Box>
				<Box
					sx={{
						background: "#ffffff",
						position: "fixed",
						bottom: 0,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography variant="caption">Präsentiert von:</Typography>
					<img
						src="https://europa.sachsen-anhalt.de/fileadmin/_processed_/8/2/csm_EFRE_mit_Rand_80528e161b.png"
						alt="Sponsor"
						width="50%"
					/>
				</Box>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						Eine neue Abstimmung ist aktiv!
					</DialogTitle>
					<DialogContent>
						<Stack direction="column" spacing={2}>
							<Typography>{pollTitle}</Typography>
							<Button
								size="large"
								onClick={handleVote}
								variant="contained"
								autoFocus
							>
								Teilnehmen
							</Button>
							<Button
								size="large"
								onClick={handleClose}
								variant="contained"
								color="inherit"
							>
								Ignorieren
							</Button>
							<Typography variant="caption">
								Sie können auch zu einem späteren Zeitpunkt an
								der Abstimmung teilnehmen.
							</Typography>
						</Stack>
					</DialogContent>
				</Dialog>
			</Box>
		</React.Fragment>
	);
}

export default EventViewP;
