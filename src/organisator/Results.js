import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

import PercentIcon from "@mui/icons-material/Percent";

import Icon from "@mdi/react";
import { mdiNumeric } from "@mdi/js";

import BarChart from "./ResultsBarChart";
//import WordCloud from "./ResultsWordCloud";
import ResultsList from "./ResultsList";

import { useTheme } from "@mui/material/styles";

const CHARTS = [
	{
		id: "bar",
		name: "Balkendiagramm",
	},
	{
		id: "pie",
		name: "Kreisdiagramm",
		disabled: true,
	},
	{
		id: "word",
		name: "Wordcloud",
	},
	{
		id: "list",
		name: "Liste",
	},
];

function Results(props) {
	const { socket } = props;
	const { pollId } = useParams();

	const theme = useTheme();

	const [redirect, setRedirect] = useState(null);

	const [poll, setPoll] = useState({
		title: "Untitled poll",
	});
	const [results, setResults] = useState([]);

	const [chart, setChart] = useState("list");
	const [format, setFormat] = useState("numeric");
	const [type, setType] = useState("percentage");

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const createChangeChartHandler = (newChart) => () => {
		if (newChart !== null) {
			setChart(newChart);
		}
		handleClose();
	};

	const handleChangeFormat = (event, newFormat) => {
		if (newFormat !== null) {
			setFormat(newFormat);
		}
	};

	const getPoll = () => {
		fetch(`/api/polls/${pollId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setPoll(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getResults = () => {
		fetch(`/api/polls/${pollId}/results`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setResults(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getPoll();
		getResults();

		socket.on("vote-new", getResults);
		socket.on("answer-add", getResults);

		return () => {
			socket.off("vote-new", getResults);
			socket.off("answer-add", getResults);
		};
	}, []);

	const stopPoll = () => {
		fetch(`/api/polls/${pollId}/stop`, {
			method: "PUT",
		})
			.then((res) => {
				if (res.ok) {
					setPoll({ ...poll, stopped: true });
				} else {
					throw new Error("Could not stop poll");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	const totalVotes = results.reduce(
		(counter, result) => counter + result.votes,
		0
	);

	return (
		<React.Fragment>
			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				elevation={2}
			>
				{CHARTS.map((CHART) => (
					<MenuItem
						onClick={createChangeChartHandler(CHART.id)}
						disabled={Boolean(CHART.disabled)}
					>
						{chart === CHART.id && (
							<ListItemIcon>
								<CheckIcon />
							</ListItemIcon>
						)}
						<ListItemText inset={chart !== CHART.id}>
							{CHART.name}
						</ListItemText>
					</MenuItem>
				))}
			</Menu>

			<Box p={3}>
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
					<Stack direction="column" alignItems="center" spacing={2}>
						<Typography variant="h4" component="h1" align="center">
							{poll.title}
						</Typography>
						<Typography>{totalVotes} Abstimmungen</Typography>
					</Stack>
				</Box>

				<Box
					sx={{
						mt: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{chart === "bar" && <BarChart data={results} />}
					{/*chart === "word" && <WordCloud data={results} />*/}
					{chart === "list" && <ResultsList data={results} />}
				</Box>

				<Stack
					direction="row"
					spacing={1}
					justifyContent="center"
					sx={{ mt: 3 }}
				>
					<Button
						disableElevation
						variant="contained"
						color="inherit"
						endIcon={<KeyboardArrowDownIcon />}
						onClick={handleClick}
					>
						Ansicht
					</Button>
					<ToggleButtonGroup
						size="small"
						value={format}
						exclusive
						onChange={handleChangeFormat}
					>
						<ToggleButton value="numeric">
							<Icon path={mdiNumeric} size={1} />
						</ToggleButton>
						<ToggleButton value="percent">
							<PercentIcon />
						</ToggleButton>
					</ToggleButtonGroup>

					{!poll.stopped && (
						<Button
							disableElevation
							variant="contained"
							color="error"
							onClick={stopPoll}
						>
							Stoppen
						</Button>
					)}
				</Stack>
			</Box>
		</React.Fragment>
	);
}

export default Results;
