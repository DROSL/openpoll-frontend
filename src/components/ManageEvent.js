import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";

import Skeleton from "@mui/material/Skeleton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

import ShareDialog from "./ShareDialog";
import CreatePollDialog from "./CreatePollDialog";
import ListPolls from "./ListPollsO";
import CreatePollFiller from "./CreatePollFiller";

function ManageEvent() {
	const { eventId } = useParams();

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(null);

	const [title, setTitle] = useState("Untitled event");
	const [secret, setSecret] = useState("");
	const [joinable, setJoinable] = useState(true);

	const [polls, setPolls] = useState([]);
	const [pollTitle, setPollTitle] = useState(null);

	const [openShareDiaglog, toggleShareDialog] = useState(false);

	const [openNewPollDialog, toggleNewPollDialog] = useState(false);

	const [openSnackbar, toggleSnackbar] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");

	useEffect(() => {
		fetch(`/events/${eventId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setTitle(res.title);
				setSecret(res.secret);
				setJoinable(res.open);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});

		//return;

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
	}, []);

	const createPoll = (
		title,
		answers,
		allowCustomAnswers,
		votesPerParticipant
	) => {
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
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const startPoll = (pollId) => {
		fetch(`/polls/${pollId}/start`, {
			method: "PUT",
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const stopPoll = (pollId) => {
		fetch(`/polls/${pollId}/stop`, {
			method: "PUT",
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deletePoll = (id) => {
		fetch(`/polls/${id}`, {
			method: "DELETE",
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<React.Fragment>
			<ShareDialog
				open={openShareDiaglog}
				handleClose={() => {
					toggleShareDialog(false);
				}}
				code={eventId}
				secret={secret}
			/>

			<CreatePollDialog
				open={openNewPollDialog}
				handleClose={() => toggleNewPollDialog(false)}
			/>

			<Box padding={3}>
				<Stack spacing={2}>
					<Typography variant="h4">{title}</Typography>

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
								secondary={
									desktop
										? "Titel, Beschreibung und Dateianhang bearbeiten oder Veranstaltung löschen"
										: ""
								}
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
								secondary={
									desktop
										? "Event-Code anzeigen oder Organisator-Zugang teilen"
										: ""
								}
							/>
							<ChevronRightIcon />
						</ListItem>
					</List>

					<Typography variant="h6">Abstimmungen</Typography>

					{polls.length > 0 ? (
						<React.Fragment>
							<Box>
								<Button
									variant="contained"
									startIcon={<AddIcon />}
									disableElevation
									onClick={() => {
										toggleNewPollDialog(true);
									}}
								>
									Neue Abstimmung
								</Button>
							</Box>
							<ListPolls polls={polls} eventId={eventId} />
						</React.Fragment>
					) : (
						<CreatePollFiller
							handleClick={() => toggleNewPollDialog(true)}
						/>
					)}
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

export default ManageEvent;
