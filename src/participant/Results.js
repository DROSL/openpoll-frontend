import * as React from "react";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function ResultsP(props) {
	const [redirect, setRedirect] = React.useState(null);
	const [results, setResults] = React.useState(null);
	const [question, setQuestion] = React.useState("Name der Abstimmung");
	const [type, setType] = React.useState("percentage");
	const [windowWidth, setWindowWidth] = React.useState(
		window.innerWidth > 768 ? "50%" : window.innerWidth - 35
	);
	const [answers, setAnswers] = React.useState(null);
	const [pollData, setPollData] = React.useState(null);
	const [pollTitle, setPollTitle] = React.useState("Name der Abstimmung");

	let params = useParams();

	const handleBack = () => {
		setRedirect(`/p/event/${params.eventId}`);
	};

	const handlePercentage = () => {
		setType("percentage");
	};

	const handleAbsolute = () => {
		setType("absolute");
	};

	const Results = () => {
		var totalVotes = 0;
		{
			results.map((result) => {
				totalVotes = totalVotes + result.votes;
			});
		}
		return (
			<Stack spacing={1} direction="column">
				{results.map((result) => {
					var percentage =
						totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;
					return (
						<Box key={result._id} id={result._id}>
							<Box
								sx={{
									borderTopRightRadius: 10,
									borderBottomRightRadius: 10,
								}}
								color="white"
								bgcolor="primary.main"
								variant="contained"
								padding="13px"
								width={`${percentage}%`}
							/>
							<Typography>{`${result.title} ${
								type === "percentage"
									? Number.parseFloat(percentage).toFixed(2) +
									  "%"
									: result.votes
							}`}</Typography>
						</Box>
					);
				})}
			</Stack>
		);
	};

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? "60%" : windowWidth - 35);
	};

	const getResults = () => {
		const requestOptions = {
			method: "GET",
		};
		fetch(`/api/polls/${params.pollId}/votes`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setResults(data);
			})
			.catch((error) => console.log(error));
	};

	const socketListeners = () => {
		const socket = props.socket;
		socket.on("event-delete", (code) => {
			console.log("EVENT DELETED");
			setRedirect("/");
		});

		socket.on("vote-new", (code, poll_id, answer_id) => {
			getResults();
		});
	};

	const getPollData = () => {
		const requestOptions = {
			method: "GET",
		};
		fetch(`/api/polls/${params.pollId}`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setQuestion(data.title);
			})
			.catch((error) => console.log(error));
	};

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);

		getResults();
		getPollData();
		socketListeners();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<React.Fragment>
			<Box sx={{ width: windowWidth, margin: "auto" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: "15px",
					}}
				>
					<Button size="large" onClick={handleBack} variant="text">
						<ArrowBackIosIcon
							sx={{ color: "primary.main", marginRight: "5px" }}
						/>
						Zurück
					</Button>
				</Box>
				<Box direction="horizontal">
					<Typography variant="h3">Ergebnisse</Typography>
					<Typography variant="h6">{question}</Typography>
					<Stack sx={{ marginTop: "10px" }} direction="row">
						<Button
							size="large"
							onClick={handlePercentage}
							variant="text"
						>
							Prozent
						</Button>
						<Button
							size="large"
							onClick={handleAbsolute}
							variant="text"
						>
							Absolut
						</Button>
					</Stack>
				</Box>
				{results ? <Results /> : null}
			</Box>
		</React.Fragment>
	);
}

export default ResultsP;
