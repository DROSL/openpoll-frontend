import * as React from "react";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function VoteP(props) {
	const [redirect, setRedirect] = React.useState(null);
	const [remainingTime, setRemainingTime] = React.useState(null)
	const [votes, setVotes] = React.useState(1);
	const [answers, setAnswers] = React.useState(null);
	const [resultsDialog, setResultsDialog] = React.useState(false);
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth > 768 ? '50%' : window.innerWidth - 35);
	const [pollData, setPollData] = React.useState(null);
	const [pollTitle, setPollTitle] = React.useState("Name der Abstimmung");
	const [voteProcessing, setVoteProcessing] = React.useState(false);

	let params = useParams();

	const handleBack = () => {
		setRedirect(`/p/event/${params.eventId}`);
	}

	const handleResults = () => {
		if (votes > 0) {
			setResultsDialog(true)
		} else {
			setRedirect(`/p/event/${params.eventId}/poll/${params.pollId}/results`);
		}
	}

	const handleProceedResults = () => {
		setRedirect(`/p/event/${params.eventId}/poll/${params.pollId}/results`);
	}

	const handleVote = (answerId) => {
		setVoteProcessing(true);
		const requestOptions = {
			method: 'POST'
		}
		fetch(process.env.REACT_APP_API_URL + `/answers/${answerId}/vote`, requestOptions)
			.then(response => response.json())
			.then(data => {
				setVoteProcessing(false);
				setVotes(votes - 1)
			})
			.catch(error =>
				console.log(error)
			)
	}

	const handleCloseDialog = () => {
		setResultsDialog(false)
	}

	const Answers = () => {
		return (
			<Stack spacing={2} direction="column">
				{answers.map((answer) => {
					return (<Button disabled={voteProcessing} size="large" onClick={() => handleVote(answer._id)} key={answer._id} id={answer._id} variant="contained">
						{answer.title}
					</Button>)
				})}
			</Stack>
		)
	}

	const formatTime = () => {
		var m = Math.floor(remainingTime % 3600 / 60);
		var s = Math.floor(remainingTime % 3600 % 60);

		var mDisplay = m > 0 ? (m < 10 ? `0${m}` : m) : "00";
		var sDisplay = s > 0 ? (s < 10 ? `0${s}` : s) : "00";

		return (`${mDisplay}:${sDisplay}`)
	}

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? '60%' : (windowWidth - 35));
	};

	const processPollData = (data) => {
		setPollData(data);
		const activeUntil = new Date(data.activeUntil);
		const currentTime = new Date();
		const diff = activeUntil.getTime() - currentTime.getTime();
		setRemainingTime(diff / 1000)
		setVotes(data.votesPerParticipant);
	}

	const getAnswers = () => {
		const requestOptions = {
			method: 'GET'
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}/answers`, requestOptions)
			.then(response => response.json())
			.then(data => {
				setAnswers(data)
			})
			.catch(error =>
				console.log(error)
			)
	}

	const getPollData = () => {
		const requestOptions = {
			method: 'GET',
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}`, requestOptions)
			.then(response => response.json())
			.then(data => {
				processPollData(data);
				getAnswers();
			})
			.catch(error =>
				console.log(error)
			)
	}

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);

		getPollData();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(
			() => {
				if (remainingTime < 0) {
					setRedirect(`/p/event/${params.eventId}/poll/${params.pollId}/results`);
				} else {
					setRemainingTime(remainingTime - 1);
				}
			},
			1000
		);
		return () => {
			clearInterval(interval);
		}
	}, [remainingTime, params.eventId, params.pollId]);

	if (redirect) {
		return <Navigate pollId={params.pollId} to={redirect} />;
	}

	if (votes === 0) {
		handleResults()
	}

	return (
		<React.Fragment>
			<Box
				sx={{
					width: windowWidth,
					margin: 'auto'
				}}
			>
				<Dialog
					open={resultsDialog}
					onClose={handleCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						Zu den Ergebnissen?
					</DialogTitle>
					<DialogContent>
						<Stack direction="column" spacing={2}>
							<Typography variant="caption">Sie haben noch nicht alle Ihre Stimmen verwendet. Wenn Sie fortfahren, verfallen Ihre restlichen Stimmen.</Typography>
							<Button size="large" onClick={handleProceedResults} variant="contained" autoFocus>Zu den Ergebnissen</Button>
							<Button size="large" onClick={handleCloseDialog} variant="contained" color="inherit">Abbrechen</Button>
						</Stack>
					</DialogContent>
				</Dialog>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: '15px',
					}}
				>
					<Button size="large" onClick={handleBack} variant="text">
						<ArrowBackIosIcon sx={{ color: 'primary.main', marginRight: '5px' }} />
						Zurück
					</Button>
				</Box>
				<Typography variant="h3">
					{pollTitle}
				</Typography>
				<Box
					sx={{
						marginTop: '10px',
						marginBottom: '10px',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Typography variant="caption">
							{formatTime(remainingTime) + " "}
						</Typography>
					</Box>
					<Typography variant="caption">
						{votes} Stimme(n)
					</Typography>
				</Box>
				{answers ?
					<Answers /> : null
				}
			</Box>
		</React.Fragment>
	);
}

export default VoteP;