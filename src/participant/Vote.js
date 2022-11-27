import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AddIcon from "@mui/icons-material/Add";

import VoteFinish from "../filler/VoteFinish";
import PollStopped from "../filler/PollStopped";

const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

function Vote(props) {
	const { socket } = props;
	const { eventId, pollId } = useParams();

	const [redirect, setRedirect] = useState(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);

	const [title, setTitle] = useState("");
	const [stopped, setStopped] = useState(false);
	const setStoppedTrue = () => {
		setStopped(true);
	};
	const [answers, setAnswers] = useState([]);

	const [allowMultipleVotesPerAnswer, setAllowMultipleVotesPerAnswer] =
		useState(false);
	const [allowCustomAnswers, setAllowCustomAnswers] = useState(false);

	const [totalVotes, setTotalVotes] = useState(0);
	const [votes, setVotes] = useState([]);
	const remainingVotes = totalVotes - votes.length;
	const finished = !loading && remainingVotes === 0;

	const [open, toggleDialog] = useState(false);
	const [customAnswer, setCustomAnswer] = useState("");

	const handleClose = () => {
		toggleDialog(false);
	};

	const handleChange = (event) => {
		setCustomAnswer(event.target.value);
	};

	useEffect(() => {
		setCustomAnswer("");
	}, [open]);

	const getPoll = () => {
		fetch(`/api/polls/${pollId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((poll) => {
				setTitle(poll.title);
				setStopped(poll.stopped);
				setTotalVotes(poll.votesPerParticipant);
				setAllowMultipleVotesPerAnswer(
					poll.allowMultipleVotesPerAnswer
				);
				setAllowCustomAnswers(poll.allowCustomAnswers);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAnswers = () => {
		fetch(`/api/polls/${pollId}/answers`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setAnswers(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getVotes = () => {
		fetch(`/api/polls/${pollId}/votes`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setVotes(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getPoll();
		getAnswers();
		getVotes();

		socket.on("poll-stop", setStoppedTrue);
		socket.on("answer-add", getAnswers);

		return () => {
			socket.off("poll-stop", setStoppedTrue);
			socket.off("answer-add", getAnswers);
		};
	}, []);

	const handleVote = (answerId) => {
		setProcessing(true);
		fetch(`/api/answers/${answerId}/vote`, {
			method: "POST",
		})
			.then((res) => res.json())
			.then((data) => {
				setVotes([...votes, data]);
				setProcessing(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const createAnswer = () => {
		fetch(`/api/polls/${pollId}/answers`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: customAnswer,
			}),
		})
			.then((res) => res.json())
			.then((answer) => {
				setAnswers([...answers, answer]);
				handleVote(answer._id);
				toggleDialog(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const redirectToEvent = () => {
		setRedirect(`/p/event/${eventId}`);
	};

	const redirectToResults = () => {
		setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	if (stopped) {
		return (
			<PollStopped
				handleBack={redirectToEvent}
				handleResults={redirectToResults}
			/>
		);
	}

	if (finished) {
		return (
			<VoteFinish
				handleBack={redirectToEvent}
				handleResults={redirectToResults}
			/>
		);
	}

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
				<DialogTitle>Eigene Antwort</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						variant="standard"
						label="Antwort"
						value={customAnswer}
						onChange={handleChange}
					/>
					<Typography variant="caption">
						Ihre Antwort wird den anderen Teilnehmern als weitere
						Antwortmöglichkeit angezeigt.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Abbrechen</Button>
					<Button onClick={createAnswer}>Abstimmen</Button>
				</DialogActions>
			</Dialog>

			<Box p={3}>
				<Box
					sx={(theme) => ({
						width: "100%",
						maxWidth: theme.breakpoints.values.sm,
						margin: "auto",
					})}
				>
					<Box
						sx={{
							width: "100%",
							minHeight: 200,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxSizing: "border-box",
						}}
					>
						<Stack
							direction="column"
							alignItems="center"
							spacing={2}
						>
							<Typography
								variant="h4"
								component="h1"
								align="center"
							>
								{title}
							</Typography>
							<Typography>
								{remainingVotes === 1
									? "1 Stimme verbleibend"
									: `${remainingVotes} Stimmen verbleibend`}
							</Typography>
						</Stack>
					</Box>
					<Stack spacing={1} sx={{ mt: 3 }}>
						{answers.map((answer, index) => {
							const count = votes.filter(
								(vote) => vote.answer === answer._id
							).length;
							const disabled =
								processing ||
								(count > 0 && !allowMultipleVotesPerAnswer);

							return (
								<Button
									fullWidth
									disableElevation
									size="large"
									variant="contained"
									key={`vote-${answer._id}`}
									onClick={() => handleVote(answer._id)}
									disabled={disabled}
									sx={{
										backgroundColor:
											ANSWER_COLORS[
												index % ANSWER_COLORS.length
											],
									}}
								>
									{count > 0 && allowMultipleVotesPerAnswer
										? `${answer.title} (${count})`
										: answer.title}
								</Button>
							);
						})}
						{allowCustomAnswers && (
							<Button
								fullWidth
								disableElevation
								variant="contained"
								color="inherit"
								startIcon={<AddIcon />}
								onClick={() => {
									toggleDialog(true);
								}}
							>
								Eigene Antwort
							</Button>
						)}
					</Stack>
				</Box>
			</Box>
		</React.Fragment>
	);
}

export default Vote;
