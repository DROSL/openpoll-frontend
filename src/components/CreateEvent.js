import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BarChartIcon from "@mui/icons-material/BarChart";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import spooky from "./spooky.svg";

import { CopyToClipboard } from "react-copy-to-clipboard";

function CreateEvent() {
	const { eventId } = useParams();
	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(null);

	const [evt, setEvent] = useState({
		title: "Untitled event",
		code: eventId,
		secret: null,
	});

	const [polls, setPolls] = useState([]);
	const [pollTitle, setPollTitle] = useState(null);

	const [openShareDiaglog, toggleShareDialog] = useState(false);
	const [tab, setTab] = useState(0);
	const [joinable, setJoinable] = useState(true);

	const [openNewPollDiaglog, toggleNewPollDialog] = useState(false);
	const [openDeleteEventDialog, toggleDeleteEventDialog] = useState(false);

	const [openSnackbar, toggleSnackbar] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");

	const getEvent = () => {
		fetch(`/events/${eventId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setEvent({
					title: res.title,
					secret: res.secret,
				});
				setJoinable(res.open);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getPolls = () => {
		fetch(`/events/${eventId}/polls`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setPolls(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getEvent();
		getPolls();
	}, []);

	const createPoll = () => {
		if (pollTitle != null) {
			fetch(`/events/${eventId}/polls`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: pollTitle,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					setRedirect(`/o/event/${eventId}/newPoll/${res._id}`);
				})
				.catch((err) => console.log(err));
		}
	};

	const startPoll = (poll) => {
		fetch(`/polls/${poll._id}/start`, {
			method: "PUT",
		})
			.then((res) => getPolls())
			.catch((err) => console.log(err));
	};

	const deletePoll = (id) => {
		fetch(`/polls/${id}`, {
			method: "DELETE",
		})
			.then((res) => getPolls())
			.catch((err) => console.log(err));
	};

	const handleTabChange = (event, newValue) => {
		setTab(newValue);
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
								paddingTop: 5,
								paddingBottom: 5,
							}}
						>
							<Typography
								sx={{ marginLeft: 5 }}
							>{`${poll.title}`}</Typography>
							<Box sx={{ display: "flex", flexDirection: "row" }}>
								{!poll.activeUntil ? (
									<Box>
										<Button
											onClick={() => startPoll(poll)}
											size="large"
											variant="text"
											color="success"
											startIcon={<PlayArrowIcon />}
										>
											Starten
										</Button>
										<Button
											component={Link}
											to={`/o/event/${eventId}/newPoll/${poll._id}`}
											size="large"
											variant="text"
											startIcon={<EditIcon />}
										>
											Bearbeiten
										</Button>
									</Box>
								) : (
									<Button
										component={Link}
										to={`/o/event/${eventId}/poll/${poll._id}/results`}
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

	return (
		<React.Fragment>
			<Dialog
				open={openShareDiaglog}
				fullWidth
				maxWidth="sm"
				onClose={() => toggleShareDialog(false)}
			>
				<DialogTitle>Veranstaltung teilen</DialogTitle>
				<DialogContent>
					<Tabs value={tab} onChange={handleTabChange}>
						<Tab label="Teilnehmer" />
						<Tab label="Organisatoren" />
					</Tabs>
					{tab == 0 && (
						<Box mt={2}>
							<Stack>
								<FormControl>
									<FormControlLabel
										control={
											<Switch
												checked={joinable}
												onChange={(e) => {
													setJoinable(
														e.target.checked
													);
												}}
											/>
										}
										label="Neue Teilnehmer können der Veranstaltung beitreten"
									/>
								</FormControl>
								<Box mt={2}>
									<FormControl variant="outlined">
										<OutlinedInput
											readOnly
											autoFocus
											onFocus={(e) => {
												e.target.select();
											}}
											value={`${eventId}`}
											endAdornment={
												<InputAdornment position="end">
													<IconButton edge="end">
														<ContentCopyIcon />
													</IconButton>
												</InputAdornment>
											}
										/>
									</FormControl>
								</Box>
							</Stack>
						</Box>
					)}
					{tab == 1 && (
						<Stack mt={2} spacing={2}>
							<Alert severity="warning">
								<AlertTitle>Achtung</AlertTitle>
								Organisatoren haben vollen Zugriff auf Ihre
								Veranstaltung. Teilen Sie den Link nur mit
								Personen, denen Sie vertrauen!
							</Alert>
							<FormControl variant="outlined">
								<OutlinedInput
									readOnly
									fullWidth
									autoFocus
									onFocus={(e) => {
										e.target.select();
									}}
									value={`${window.location.origin}/o/event/join/${evt.secret}`}
									endAdornment={
										<InputAdornment position="end">
											<IconButton edge="end">
												<ContentCopyIcon />
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</Stack>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => toggleShareDialog(false)}>
						Schließen
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openNewPollDiaglog}
				fullWidth
				maxWidth="sm"
				onClose={() => toggleNewPollDialog(false)}
			>
				<DialogTitle>Neue Abstimmung</DialogTitle>
				<DialogContent>
					<DialogContentText></DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						fullWidth
						variant="standard"
						label="Titel"
						placeholder="Welcher ist der längste Fluss der Welt?"
						onChange={(e) => {
							setPollTitle(e.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => toggleNewPollDialog(false)}>
						Abbrechen
					</Button>
					<Button onClick={createPoll}>Erstellen</Button>
				</DialogActions>
			</Dialog>

			<Box padding={3}>
				<Stack spacing={2}>
					<Typography variant="h4">{evt.title}</Typography>

					<List>
						<ListItem
							component={Link}
							to={`/o/event/${eventId}/edit`}
							button
						>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText
								primary="Veranstaltung anpassen"
								secondary="Titel, Beschreibung und Dateianhang bearbeiten oder Veranstaltung löschen"
							/>
							<ChevronRightIcon />
						</ListItem>
						<ListItem
							button
							onClick={() => toggleShareDialog(true)}
						>
							<ListItemIcon>
								<GroupIcon />
							</ListItemIcon>
							<ListItemText
								primary="Teilnehmer einladen"
								secondary="Event-Code anzeigen oder Organisator-Zugang teilen"
							/>
							<ChevronRightIcon />
						</ListItem>
					</List>

					<Typography variant="h6">Abstimmungen</Typography>

					<Box
						sx={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Stack direction="column" alignItems="center">
							<img
								src={spooky}
								alt="Noch keine Abstimmungen erstellt"
								width="150px"
							/>
							<Typography sx={{ mt: 2, fontWeight: "bold" }}>
								Ziemlich leer hier
							</Typography>
							<Typography>
								Beginnen Sie, indem Sie ihre erste Abstimmung
								erstellen!
							</Typography>
							<Button
								size="large"
								variant="contained"
								color="primary"
								disableElevation
								startIcon={<AddIcon />}
								onClick={() => toggleNewPollDialog(true)}
								sx={{ mt: 2 }}
							>
								Neue Abstimmung
							</Button>
						</Stack>
					</Box>

					<Stack direction="column">{polls ? <Polls /> : null}</Stack>
				</Stack>
			</Box>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				onClose={() => toggleSnackbar(false)}
				message={snackbarText}
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={() => toggleSnackbar(false)}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		</React.Fragment>
	);
}

export default CreateEvent;
