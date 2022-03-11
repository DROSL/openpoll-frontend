import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ListPolls from "./ListPollsP";

import spooky from "../images/spooky.svg";

import { io } from "socket.io-client";

function ViewEvent(props) {
	const { eventId } = useParams();

	const [redirect, setRedirect] = useState(null);

	const [title, setTitle] = useState("Unbenannte Veranstaltung");
	const [description, setDescription] = useState("");
	const [file, setFile] = useState(null);

	const [polls, setPolls] = useState([]);

	const [open, toggleDialog] = useState(false);

	const [pollTitle, setPollTitle] = useState(null);
	const [pollId, setPollId] = useState(null);
	const [pollActive, setPollActive] = useState(false);

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
			.catch((error) => console.log(error));
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
		socketListeners();
	}, []);

	const handleClickVote = (pollId) => {
		toggleDialog(false);

		setRedirect(`/p/event/${eventId}/poll/${pollId}`);
	};

	const handleClickResults = (pollsId) => {
		setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
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
			toggleDialog(true);
		});
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={() => {
					toggleDialog(false);
				}}
			>
				<DialogTitle>Eine neue Abstimmung ist aktiv!</DialogTitle>
				<DialogContent>
					<Stack direction="column" spacing={2}>
						<Typography>{pollTitle}</Typography>
						<Button
							autoFocus
							disableElevation
							size="large"
							variant="contained"
							onClick={() => {
								toggleDialog(false);
							}}
						>
							Teilnehmen
						</Button>
						<Button
							disableElevation
							size="large"
							variant="contained"
							color="inherit"
							onClick={() => {
								toggleDialog(false);
							}}
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
