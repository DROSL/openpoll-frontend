import * as React from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function NewPoll() {
	let params = useParams();

	const [redirect, setRedirect] = React.useState(null);
	const [pollTitle, setPollTitle] = React.useState("Unbenannte Abstimmung");
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth > 768 ? '50%' : window.innerWidth - 35);
	const [isMobile, setIsMobile] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [answers, setAnswers] = React.useState([]);
	const [answerName, setAnswerName] = React.useState(null);
	const [pollId, setPollId] = React.useState(null);
	const [maxVotes, setMaxVotes] = React.useState(1);
	const [voteTime, setVoteTime] = React.useState(3);
	const [freeText, setFreeText] = React.useState(false);
	const [multipleVotes, setMultipleVotes] = React.useState(true);

	const handleSubmission = (file) => {
		const formData = new FormData();

		formData.append('File', file);
		formData.append('code', params.evendId);

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: formData
		}

		fetch(process.env.REACT_APP_API_URL + `/events/${params.eventId}/file`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleClose = () => {
		setOpen(false);
	}

	const handleFocus = (event) => event.target.select();

	const handleBack = () => {
		setRedirect(`/o/event/${params.eventId}`)
	}

	const addAnswer = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ poll_id: pollId, title: answerName })
		}

		fetch(process.env.REACT_APP_API_URL + `/polls/${pollId}/answers`, requestOptions)
			.then(response => response.json())
			.then(result => {
				setOpen(false);
				const newAnswers = { _id: result._id, title: result.title, hidden: false };
				setAnswers(answers => [...answers, newAnswers]);
			})
			.catch((error) => {
				console.log(error)
				setOpen(false)
			});
	}

	const deleteAnswer = (answer) => {
		const requestOptions = {
			method: 'DELETE'
		}

		fetch(process.env.REACT_APP_API_URL + `/answers/${answer._id}`, requestOptions)
			.then(response => getAnswers())
			.catch((error) => {
				console.log(error)
				setOpen(false)
			});
	}

	const handleNewAnswer = () => {
		setOpen(true);
	}

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? '60%' : windowWidth - 35);
		setIsMobile(windowWidth > 768 ? false : true);
	};

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

	const getPollMeta = () => {
		const requestOptions = {
			method: 'GET'
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}`, requestOptions)
			.then(response => response.json())
			.then(data => {
				setPollTitle(data.title)
				getAnswers()
			})
			.catch(error =>
				console.log(error)
			)
	}

	const save = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ poll_id: pollId, title: pollTitle, duration: voteTime / 60, votesPerParticipant: maxVotes, allowCustomAnswers: freeText })
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}`, requestOptions)
			.then(response => setRedirect(`/o/event/${params.eventId}`))
			.catch(error =>
				console.log(error)
			)
	}

	const start = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ poll_id: pollId, title: pollTitle, duration: voteTime * 60, votesPerParticipant: maxVotes, allowCustomAnswers: freeText, allowMultipleVotesPerAnswer: multipleVotes })
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}`, requestOptions)
			.then(response => startSaved())
			.catch(error =>
				console.log(error)
			)
	}

	const startSaved = () => {
		const requestOptions = {
			method: 'PUT'
		}
		fetch(process.env.REACT_APP_API_URL + `/polls/${params.pollId}/start`, requestOptions)
			.then(response => setRedirect(`/o/event/${params.eventId}`))
			.catch(error =>
				console.log(error)
			)
	}

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		setPollId(params.pollId);
		getPollMeta();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (redirect) {
		return <Navigate to={redirect} eventId={params.eventId} />;
	}

	const Answers = () => {
		return (
			<Stack sx={{ marginTop: '15px', marginBottom: '20px' }} spacing={2} direction="column">
				{answers.map((answer) => {
					return (<Box sx={{ paddingTop: '3px', paddingBottom: '3px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={answer._id} id={answer._id}>
						{answer.title}
						<IconButton onClick={() => deleteAnswer(answer)} aria-label="delete">
							<DeleteForeverIcon />
						</IconButton>
					</Box>)
				})
				}
			</Stack >
		)
	}

	const handleTimeInput = (e) => {
		setVoteTime(e.target.value)
	}

	const handleVotesInput = (e) => {
		setMaxVotes(e.target.value)
	}

	const checkFreeText = (e) => {
		setFreeText(e.target.checked)
	}

	const checkMultipleVotes = (e) => {
		setMultipleVotes(e.target.checked)
	}

	return (
		<Box sx={{ width: windowWidth, margin: 'auto' }}>
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
					Abbrechen
				</Button>
			</Box>
			<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }} variant="h4">{pollTitle}</Typography>
			<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>Antwortmöglichkeiten:</Typography>
			{answers ? <Answers /> : null}
			<Button onClick={handleNewAnswer} size="large" variant="contained">
				+ Antwortmöglichkeit hinzufügen
			</Button>
			<Divider sx={{ marginTop: '20px', marginBottom: '20px' }} />
			<FormGroup sx={{ marginTop: '10px' }}>
				<FormControlLabel control={<Checkbox onChange={checkFreeText} defaultChecked={false} />} label="Freitextantworten zulassen" />
				<FormControlLabel control={<Checkbox onChange={checkMultipleVotes} defaultChecked={true} />} label="Mehrfachstimmen zulassen" />
			</FormGroup>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>Anzahl der Stimmen pro Teilnehmer:</Typography>
				<TextField
					onChange={handleVotesInput}
					id="filled-number"
					label="Anzahl Stimmen"
					type="number"
					value={maxVotes}
					InputLabelProps={{
						shrink: true,
					}}
					variant="outlined"
				/>
			</Box>
			<Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>Dauer (Minuten)</Typography>
				<TextField
					onChange={handleTimeInput}
					id="filled-number"
					label="Dauer (Minuten)"
					type="number"
					value={voteTime}
					InputLabelProps={{
						shrink: true,
					}}
					variant="outlined"
				/>
			</Box>
			{/*<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>Sonstiges:</Typography>
			<FormGroup sx={{ marginTop: '10px' }}>
				<FormControlLabel control={<Checkbox defaultChecked={true} />} label="Teilnehmer dürfen Ergebnisse während der Abstimmung anzeigen" />
				<FormControlLabel control={<Checkbox defaultChecked={true} />} label="Anzahl der Stimmen für Teilnehmer während der Abstimmung einblenden" />
				<FormControlLabel control={<Checkbox defaultChecked={true} />} label="Teilnehmer dürfen Ergebnisse nach der Abstimmung anzeigen" />
				<FormControlLabel control={<Checkbox defaultChecked={true} />} label="Anzahl der Stimmen für Teilnehmer nach der Abstimmung einblenden" />
				<FormControlLabel control={<Checkbox defaultChecked={true} />} label="Teilnehmer dürfen während der Abstimmung Restzeit anzeigen" />
			</FormGroup>*/}
			<Stack sx={{ marginTop: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'right' }} direction="row" spacing={2}>
				<Button onClick={save} variant="contained">Abstimmung speichern</Button>
				<Button onClick={start} variant="contained">Abstimmung starten</Button>
			</Stack>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Neue Antwortmöglichkeit
				</DialogTitle>
				<DialogContent>
					<Stack direction="column" spacing={2}>
						<TextField onClick={isMobile ? handleFocus : null} sx={{ width: '100%' }} id="standard-basic" label="Antwortmöglichkeit" variant="standard" onChange={(event) => {
							setAnswerName(event.target.value);
						}} />
						<Button size="large" onClick={addAnswer} variant="contained" autoFocus>Hinzufügen</Button>
						<Button size="large" onClick={handleClose} variant="contained" color="inherit">Abbrechen</Button>
					</Stack>
				</DialogContent>
			</Dialog>
		</Box >
	);
}

export default NewPoll;
