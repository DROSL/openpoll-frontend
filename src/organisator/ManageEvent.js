import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Skeleton from "@mui/material/Skeleton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import EditEventDialog from "./EditEventDialog";
import ShareEventDialog from "./ShareEventDialog";
import CreatePollDialog from "./EditPollDialog";
import EditPollDialog from "./EditPollDialog";
import ListPolls from "./ListPolls";
import CreatePollFiller from "../filler/CreatePollFiller";
import DeleteEventDialog from "./DeleteEventDialog";
import NotFound from "../NotFound";

function ManageEvent(props) {
	const { socket } = props;
	const { eventId } = useParams();

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(null);

	const [title, setTitle] = useState("Unbenannte Veranstaltung");
	const [description, setDescription] = useState("");
	const [file, setFile] = useState(null);
	const [secret, setSecret] = useState("");
	const [joinable, setJoinable] = useState(true);

	const [polls, setPolls] = useState([]);

	const [pollToBeEdited, setPollToBeEdited] = useState(null);

	const [openEditEventDialog, toggleEditEventDialog] = useState(false);
	const [openDeleteEventDialog, toggleDeleteEventDialog] = useState(false);
	const [openShareDiaglog, toggleShareEventDialog] = useState(false);
	const [openNewPollDialog, toggleNewPollDialog] = useState(false);
	const [openEditPollDialog, toggleEditPollDialog] = useState(false);

	const [errorEventNotFound, setErrorEventNotFound] = useState(false);

	const getEvent = () => {
		fetch(`/events/${eventId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setTitle(res.title);
				setDescription(res.description);
				setFile(res.file);
				setSecret(res.secret);
				setJoinable(res.open);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setErrorEventNotFound(true);
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

	const editEvent = (title, description, file, deleteFile) => {
		fetch(`/events/${eventId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
			}),
		})
			.then((res) => {
				if (!res.ok) {
					setTitle(title);
					setDescription(description);
					toggleEditEventDialog(false);
				} else {
					throw new Error("Could not edit event");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deleteEvent = () => {
		fetch(`/events/${eventId}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					setRedirect("/");
				} else {
					throw new Error("Could not delete event");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const changeJoinable = (newJoinable) => {
		fetch(`/events/${eventId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				open: newJoinable,
			}),
		})
			.then((res) => {
				console.log(res);
				if (res.ok) {
					setJoinable(newJoinable);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const createPoll = (
		title,
		answers,
		allowCustomAnswers,
		votesPerParticipant,
		allowMultipleVotesPerAnswer
	) => {
		fetch(`/events/${eventId}/polls`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				answers,
				allowCustomAnswers,
				votesPerParticipant,
				allowMultipleVotesPerAnswer,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setPolls([...polls, res]);
				toggleNewPollDialog(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleClickEditPoll = (pollId) => {
		setPollToBeEdited(polls.filter(p => p._id === pollId));
		toggleEditPollDialog(true);
	}

	const editPoll = (
		title,
		answers,
		allowCustomAnswers,
		votesPerParticipant,
		allowMultipleVotesPerAnswer
	) => {
		return;
	}

	const startPoll = (pollId) => {
		fetch(`/polls/${pollId}/start`, {
			method: "PUT",
		})
			.then((res) => {
				if (res.ok) {
					setPolls(
						polls.map((poll) => ({
							...poll,
							started: poll._id === pollId ? true : poll.started,
						}))
					);
				}
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
				if (res.ok) {
					setPolls(
						polls.map((poll) => ({
							...poll,
							stopped: poll._id === pollId ? true : poll.stopped,
						}))
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deletePoll = (pollId) => {
		fetch(`/polls/${pollId}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					setPolls(polls.filter((poll) => poll._id !== pollId));
				} else {
					throw new Error("Could not delete poll");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const showResults = (pollId) => {
		setRedirect(`/o/event/${eventId}/poll/${pollId}/results`);
	};

	const deleteResults = (pollId) => {
		fetch(`/polls/${pollId}/results`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					setPolls(
						polls.map((poll) => ({
							...poll,
							...(poll._id === pollId && {
								started: false,
								stopped: false,
							}),
						}))
					);
				} else {
					throw new Error("Could not delete results");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	if (errorEventNotFound) {
		return <NotFound />;
	}

	return (
		<React.Fragment>
			<EditEventDialog
				open={openEditEventDialog}
				handleClose={() => {
					toggleEditEventDialog(false);
				}}
				handleSave={editEvent}
				handleDelete={() => {
					toggleDeleteEventDialog(true);
				}}
				title={title}
				description={description}
				file={file}
			/>

			<DeleteEventDialog
				open={openDeleteEventDialog}
				handleCancel={() => {
					toggleDeleteEventDialog(false);
				}}
				handleConfirm={deleteEvent}
			/>

			<ShareEventDialog
				open={openShareDiaglog}
				handleClose={() => {
					toggleShareEventDialog(false);
				}}
				code={eventId}
				secret={secret}
				joinable={joinable}
				handleChangeJoinable={changeJoinable}
			/>

			<CreatePollDialog
				open={openNewPollDialog}
				handleClose={() => toggleNewPollDialog(false)}
				handleSave={createPoll}
			/>

			<EditPollDialog
				open={openEditPollDialog}
				handleClose={() => toggleEditPollDialog(false)}
				handleSave={editPoll}
				poll={pollToBeEdited}
			/>

			<Box p={3}>
				<Stack spacing={2}>
					<Typography
						variant="h4"
						component="h1"
						sx={{ wordWrap: "break-word" }}
					>
						{title}
					</Typography>

					<List>
						<ListItem
							button
							onClick={() => toggleEditEventDialog(true)}
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
							onClick={() => toggleShareEventDialog(true)}
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

					<Typography variant="h6" component="h2">
						Abstimmungen
					</Typography>

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
							<ListPolls
								polls={polls}
								eventId={eventId}
								editPoll={handleClickEditPoll}
								startPoll={startPoll}
								stopPoll={stopPoll}
								deletePoll={deletePoll}
								showResults={showResults}
								deleteResults={deleteResults}
							/>
						</React.Fragment>
					) : (
						<CreatePollFiller
							handleClick={() => toggleNewPollDialog(true)}
						/>
					)}
				</Stack>
			</Box>
		</React.Fragment>
	);
}

export default ManageEvent;
