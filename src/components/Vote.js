import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
	DialogActions,
	DialogContentText,
	TextField,
	Typography,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AddIcon from "@mui/icons-material/Add";

const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

function Vote(props) {
	const { eventId, pollId } = useParams();

	const [redirect, setRedirect] = useState(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);

	const [title, setTitle] = useState("");
	const [answers, setAnswers] = useState([]);

	const [allowMultipleVotesPerAnswer, setAllowMultipleVotesPerAnswer] =
		useState(false);
	const [allowCustomAnswers, setAllowCustomAnswers] = useState(false);

	const [totalVotes, setTotalVotes] = useState(0);
	const [votes, setVotes] = useState(0);
	const remainingVotes = totalVotes - votes.length;

	const [open, toggleDialog] = useState(false);

	const getPoll = () => {
		fetch(`/polls/${pollId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setTitle(data.title);
				setTotalVotes(data.votesPerParticipant);
				setAllowMultipleVotesPerAnswer(
					data.allowMultipleVotesPerAnswer
				);
				setAllowCustomAnswers(data.allowCustomAnswers);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAnswers = () => {
		fetch(`/polls/${pollId}/answers`, {
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
		fetch(`/polls/${pollId}/votes`, {
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
	}, []);

	const handleVote = (answerId) => {
		setProcessing(true);
		fetch(`/answers/${answerId}/vote`, {
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

	const handleResults = () => {
		if (votes > 0) {
			toggleDialog(true);
		} else {
			//setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
		}
	};

	const handleProceedResults = () => {
		//setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
	};

	useEffect(() => {
		if (remainingVotes == 0 && !loading) {
			setRedirect(`/p/event/${eventId}/poll/${pollId}/results`);
		}
	}, [remainingVotes, loading]);

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
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>Eigene Antwort</DialogTitle>
				<DialogContent>
					<TextField fullWidth variant="standard" label="Antwort" />
					<Typography variant="caption">
						Ihre Antwort wird den anderen Teilnehmern als weitere
						Antwortmöglichkeit angezeigt.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							toggleDialog(false);
						}}
					>
						Abbrechen
					</Button>
					<Button
						onClick={() => {
							toggleDialog(false);
						}}
					>
						Abstimmen
					</Button>
				</DialogActions>
			</Dialog>

			<Box
				sx={{
					width: "100%",
					height: 300,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					p: 3,
					boxSizing: "border-box",
				}}
			>
				<Stack direction="column" alignItems="center" spacing={2}>
					<Typography variant="h4" component="h1">
						{title}
					</Typography>
					<Typography>
						{remainingVotes === 1
							? "1 Stimme verbleibend"
							: `${remainingVotes} Stimmen verbleibend`}
					</Typography>
				</Stack>
			</Box>

			<Box sx={{ width: "100%", pl: 3, pr: 3, boxSizing: "border-box" }}>
				<Stack
					sx={(theme) => ({
						width: "100%",
						maxWidth: theme.breakpoints.values.sm,
						margin: "0 auto",
					})}
					spacing={1}
				>
					{answers.map((answer, index) => {
						return (
							<Button
								key={`vote-${answer._id}`}
								fullWidth
								disableElevation
								size="large"
								variant="contained"
								sx={{
									backgroundColor:
										ANSWER_COLORS[
											index % ANSWER_COLORS.length
										],
								}}
								disabled={processing}
								onClick={() => handleVote(answer._id)}
							>
								{answer.title}
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
		</React.Fragment>
	);
}

export default Vote;
