import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ListPolls from "./ListPolls";
import NotFound from "../NotFound";

import spooky from "../images/spooky.svg";

function ViewEvent(props) {
	const { socket } = props;
	const { eventId } = useParams();

	const [redirect, setRedirect] = useState(null);

	const [title, setTitle] = useState("Unbenannte Veranstaltung");
	const [description, setDescription] = useState("");
	const [file, setFile] = useState(null);

	const [polls, setPolls] = useState([]);

	const [open, toggleDialog] = useState(false);
	const [activePoll, setActivePoll] = useState({});

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

		socket.on("event-delete", (code) => {
			console.log("EVENT DELETED");
			setRedirect("/");
		});

		socket.on("poll-start", (code, pollId, pollTitle) => {
			getPolls();
			setActivePoll({
				_id: pollId,
				title: pollTitle,
				code: code,
			});
			toggleDialog(true);
		});

		socket.on("poll-stop", (code, pollId) => {
			toggleDialog(false);
			setActivePoll({});
			setPolls(
				polls.map((poll) => ({
					...poll,
					...(poll._id === pollId && { stopped: true }),
				}))
			);
		});

		return () => {};
	}, []);

	const handleClickVote = (pollId) => {
		setRedirect(`/p/event/${eventId}/poll/${pollId}`);
	};

	const handleClickResults = (pollId) => {
		setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
	};

	const handleClose = () => {
		setActivePoll({});
		toggleDialog(false);
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	if (errorEventNotFound) {
		return <NotFound />;
	}

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Eine neue Abstimmung ist aktiv!</DialogTitle>
				<DialogContent>
					<Stack direction="column" spacing={2}>
						<Typography>{activePoll.title}</Typography>
						<Button
							autoFocus
							disableElevation
							size="large"
							variant="contained"
							onClick={() => {
								handleClickVote(activePoll._id);
							}}
						>
							Teilnehmen
						</Button>
						<Button
							disableElevation
							size="large"
							variant="contained"
							color="inherit"
							onClick={handleClose}
						>
							Ignorieren
						</Button>
						<Typography variant="caption">
							Sie können auch zu einem späteren Zeitpunkt an der
							Abstimmung teilnehmen.
						</Typography>
					</Stack>
				</DialogContent>
			</Dialog>

			<Box p={3}>
				<Stack spacing={2}>
					<Box>
						<Typography variant="h4" component="h1">
							{title}
						</Typography>
						<Typography>{description}</Typography>

						<Typography variant="h6" component="h2" sx={{ mt: 2 }}>
							Abstimmungen
						</Typography>

						{polls.length > 0 ? (
							<ListPolls
								polls={polls}
								eventId={eventId}
								startVoting={handleClickVote}
								showResults={handleClickResults}
							/>
						) : (
							<Box
								sx={{
									width: "100%",
									pt: 3,
									pb: 3,
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
									<Typography
										sx={{ mt: 2, fontWeight: "bold" }}
									>
										Ziemlich leer hier
									</Typography>
									<Typography align="center">
										Der Veranstalter hat noch keine
										Abstimmung erstellt.
										<br />
										Bitte schauen Sie später noch einmal
										vorbei!
									</Typography>
								</Stack>
							</Box>
						)}
					</Box>
				</Stack>
			</Box>
		</React.Fragment>
	);
}

export default ViewEvent;
