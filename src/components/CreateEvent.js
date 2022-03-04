import * as React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BarChartIcon from "@mui/icons-material/BarChart";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { CopyToClipboard } from "react-copy-to-clipboard";

function CreateEvent() {
	let params = useParams();

	const [polls, setPolls] = React.useState([]);
	const [deleteEventDialog, setDeleteEventDialog] = React.useState(false);
	const [newPollDialog, setNewPollDialog] = React.useState(false);
	const [redirect, setRedirect] = React.useState(null);
	const [eventTitle, setEventTitle] = React.useState(
		"Titel der Veranstaltung"
	);
	const [eventDesc, setEventDesc] = React.useState(
		"Lorem ipsum dolor sit amet, consetetur sadipscing elitr..."
	);
	const [windowWidth, setWindowWidth] = React.useState(
		window.innerWidth > 768 ? "50%" : window.innerWidth - 35
	);
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarText, setSnackbarText] = React.useState("");
	const [isMobile, setIsMobile] = React.useState(false);
	const [pollTitle, setPollTitle] = React.useState(null);
	const [secret, setSecret] = React.useState(null);

	const handleFocus = (event) => event.target.select();

	const handleDeleteEventDialogCloseDialog = () => {
		setDeleteEventDialog(false);
	};

	const handleNewPollDialogCloseDialog = () => {
		setNewPollDialog(false);
	};

	const handleDeleteEvent = () => {
		const requestOptions = {
			method: "DELETE",
		};
		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.eventId}`,
			requestOptions
		)
			.then((response) => {
				if (!response.ok) {
					Promise.reject();
				} else {
					setRedirect("/");
				}
			})
			.catch((error) => console.log(error));
	};

	const handleCreateNewPoll = () => {
		setNewPollDialog(true);
	};

	const handleNewPoll = () => {
		if (pollTitle != null) {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: `${pollTitle}` }),
			};
			fetch(
				process.env.REACT_APP_API_URL +
					`/events/${params.eventId}/polls`,
				requestOptions
			)
				.then((response) => response.json())
				.then((data) => {
					const id = data._id;
					setRedirect(`/o/event/${params.eventId}/newPoll/${id}`);
				})
				.catch((error) => console.log(error));
		}
	};

	const deletePoll = (id) => {
		const requestOptions = {
			method: "DELETE",
		};
		fetch(process.env.REACT_APP_API_URL + `/polls/${id}`, requestOptions)
			.then((response) => getPolls())
			.catch((error) => console.log(error));
	};

	const deleteEvent = () => {
		setDeleteEventDialog(true);
	};

	const closeSnackbar = () => {
		setOpenSnackbar(false);
		setSnackbarText("");
	};

	const editEvent = () => {
		setRedirect(`/o/event/${params.eventId}/edit`);
	};

	const start = (poll) => {
		const requestOptions = {
			method: "PUT",
		};
		fetch(
			process.env.REACT_APP_API_URL + `/polls/${poll._id}/start`,
			requestOptions
		)
			.then((response) => getPolls())
			.catch((error) => console.log(error));
	};

	const edit = (poll) => {
		setRedirect(`/o/event/${params.eventId}/newPoll/${poll._id}`);
	};

	const results = (pollId) => {
		setRedirect(`/o/event/${params.eventId}/poll/${pollId}/results`);
	};

	const Polls = () => {
		return (
			<Stack spacing={1} direction="column">
				{polls.map((poll) => {
					var color = poll._id % 2 === 0 ? "#ffffff" : "#f5f5f5";
					return (
						<Stack
							direction="row"
							key={poll._id}
							bgcolor={color}
							width="100%"
							sx={{
								alignItems: "center",
								justifyContent: "space-between",
								paddingTop: "5px",
								paddingBottom: "5px",
							}}
						>
							<Typography
								sx={{ marginLeft: "5px" }}
							>{`${poll.title}`}</Typography>
							<Box sx={{ display: "flex", flexDirection: "row" }}>
								{!poll.activeUntil ? (
									<Box>
										<Button
											onClick={() => start(poll)}
											size="large"
											variant="text"
											color="success"
											startIcon={<PlayArrowIcon />}
										>
											Starten
										</Button>
										<Button
											onClick={() => edit(poll)}
											size="large"
											variant="text"
											startIcon={<EditIcon />}
										>
											Bearbeiten
										</Button>
									</Box>
								) : (
									<Button
										onClick={() => results(poll._id)}
										size="large"
										variant="text"
										startIcon={<BarChartIcon />}
									>
										Ergebnisse
									</Button>
								)}

								<Button
									size="large"
									variant="text"
									color="error"
									onClick={() => deletePoll(poll._id)}
									startIcon={<DeleteForeverIcon />}
								>
									Löschen
								</Button>
							</Box>
						</Stack>
					);
				})}
			</Stack>
		);
	};

	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const ButtonShort = React.forwardRef(function Alert(props, ref) {
		return <Button sx={{ width: isMobile ? "100%" : "35%" }} {...props} />;
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
				setSecret(data.secret);
			})
			.catch((error) => console.log(error));
	};

	const getPolls = () => {
		const requestOptions = {
			method: "GET",
		};
		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.eventId}/polls`,
			requestOptions
		)
			.then((response) => response.json())
			.then((data) => {
				setPolls(data);
			})
			.catch((error) => console.log(error));
	};

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);

		getEventMeta();
		getPolls();
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (redirect) {
		return <Navigate to={redirect} eventId={params.eventId} />;
	}

	return (
		<Box sx={{ width: windowWidth, margin: "auto", marginTop: "25px" }}>
			<Dialog
				open={deleteEventDialog}
				onClose={handleDeleteEventDialogCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Veranstaltung löschen?
				</DialogTitle>
				<DialogContent>
					<Stack direction="column" spacing={2}>
						<Typography>
							Wenn Sie die Veranstaltung löschen, werden alle
							damit zusammenhängenden Daten unwiderruflich
							gelöscht.
						</Typography>
						<Button
							size="large"
							onClick={handleDeleteEvent}
							variant="contained"
							color="error"
							autoFocus
						>
							Veranstaltung löschen
						</Button>
						<Button
							size="large"
							onClick={handleDeleteEventDialogCloseDialog}
							variant="contained"
							color="inherit"
						>
							Abbrechen
						</Button>
					</Stack>
				</DialogContent>
			</Dialog>
			<Dialog
				open={newPollDialog}
				onClose={handleNewPollDialogCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Neue Abstimmung erstellen?
				</DialogTitle>
				<DialogContent>
					<Stack direction="column" spacing={2}>
						<TextField
							onClick={isMobile ? handleFocus : null}
							sx={{ width: "100%" }}
							id="standard-basic"
							label="Titel der Abstimmung"
							variant="standard"
							onChange={(event) => {
								setPollTitle(event.target.value);
							}}
						/>
						<Button
							size="large"
							onClick={handleNewPoll}
							variant="contained"
							autoFocus
						>
							Abstimmung Erstellen
						</Button>
						<Button
							size="large"
							onClick={handleNewPollDialogCloseDialog}
							color="inherit"
							variant="contained"
						>
							Abbrechen
						</Button>
					</Stack>
				</DialogContent>
			</Dialog>
			<Stack margin="15px" spacing={2}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography sx={{ typography: isMobile ? "h5" : "h4" }}>
						{eventTitle}
					</Typography>
					<Button onClick={editEvent}>
						<ModeEditIcon />
					</Button>
				</Box>
				<Typography sx={{ fontWeight: "bold" }}>
					Abstimmungen
				</Typography>
				<Stack direction="column">{polls ? <Polls /> : null}</Stack>
				<ButtonShort
					size="large"
					variant="contained"
					color="success"
					onClick={handleCreateNewPoll}
				>
					+ Neue Abstimmung
				</ButtonShort>
				<Typography sx={{ fontWeight: "bold" }}>
					Veranstaltung teilen
				</Typography>
				<CopyToClipboard
					text={`http://localhost:3000/p/event/join/${params.eventId}`}
					onCopy={() => {
						setOpenSnackbar(true);
						setSnackbarText(
							"Öffentlichen Link in die Zwischenablage kopiert."
						);
					}}
				>
					<ButtonShort size="large" variant="contained">
						Öffentlichen Link erzeugen
					</ButtonShort>
				</CopyToClipboard>
				<CopyToClipboard
					text={`http://localhost:3000/o/event/join/${secret}`}
					onCopy={() => {
						setOpenSnackbar(true);
						setSnackbarText(
							"Link zur Organisator-Ansicht in die Zwischenablage kopiert."
						);
					}}
				>
					<ButtonShort size="large" variant="contained">
						Organisator-Zugang teilen
					</ButtonShort>
				</CopyToClipboard>
				<Typography sx={{ fontWeight: "bold" }}>
					Veranstaltung löschen
				</Typography>
				<ButtonShort
					size="large"
					onClick={deleteEvent}
					variant="contained"
					color="error"
				>
					Veranstaltung löschen
				</ButtonShort>
			</Stack>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={closeSnackbar}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<Alert
					onClose={closeSnackbar}
					severity="info"
					sx={{ width: "100%" }}
				>
					{snackbarText}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default CreateEvent;
