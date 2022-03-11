import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

import PercentIcon from "@mui/icons-material/Percent";

import Icon from "@mdi/react";
import { mdiNumeric } from "@mdi/js";

import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import WordCloud from "react-wordcloud";

import { useTheme } from "@mui/material/styles";
import { grey, blue } from "@mui/material/colors";

import { io } from "socket.io-client";

const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

const CHARTS = [
	{
		id: "bar",
		name: "Balkendiagramm",
	},
	{
		id: "pie",
		name: "Kreisdiagramm",
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

function ResultsO(props) {
	const { eventId, pollId } = useParams();

	const theme = useTheme();

	const [redirect, setRedirect] = useState(null);

	const [title, setTitle] = useState("Name der Abstimmung");
	const [results, setResults] = useState([]);

	const [chart, setChart] = useState("bar");
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
		fetch(`/polls/${pollId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setTitle(data.title);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getResults = () => {
		fetch(`/polls/${pollId}/results`, {
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

	const socketListeners = () => {
		const socket = io();
		socket.on("event-delete", (code) => {
			console.log("EVENT DELETED");
			setRedirect("/");
		});

		socket.on("vote-new", (code, poll_id, answer_id) => {
			getResults();
		});
	};

	useEffect(() => {
		getResults();
		getPoll();
		socketListeners();
	}, []);

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	const bars = results
		.filter((result) => !result.hidden)
		.map((result) => ({
			name: result.title,
			value: result.votes,
		}));

	const words = results
		.filter((result) => !result.hidden)
		.map((result, index) => ({
			text: result.title,
			value: result.votes,
			color: ANSWER_COLORS[index % ANSWER_COLORS.length],
		}));

	const totalVotes = results.reduce(
		(counter, result) => counter + result.votes,
		0
	);

	return (
		<React.Fragment>
			<Box p={3}>
				<Typography variant="h4">Ergebnisse</Typography>
				<Typography>{title}</Typography>

				<Button disableElevation variant="contained" color="error">
					Stoppen
				</Button>

				<Typography>{totalVotes} Abstimmungen</Typography>

				<Button
					disableElevation
					variant="contained"
					color="inherit"
					endIcon={<KeyboardArrowDownIcon />}
					onClick={handleClick}
				>
					Ansicht
				</Button>

				<Menu
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					elevation={2}
				>
					{CHARTS.map((CHART) => (
						<MenuItem onClick={createChangeChartHandler(CHART.id)}>
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

				<Button
					disableElevation
					variant="contained"
					endIcon={<KeyboardArrowDownIcon />}
				>
					Export
				</Button>

				{chart === "bar" && (
					<BarChart width={700} height={400} data={bars}>
						<XAxis
							dataKey="name"
							dy={10}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis axisLine={false} tickLine={false} />
						<CartesianGrid stroke={grey[300]} vertical={false} />
						<Bar
							isAnimationActive={true}
							type="monotone"
							dataKey="value"
							fill={blue[500]}
							maxBarSize={50}
						/>
					</BarChart>
				)}

				{chart === "pie" && (
					<PieChart width={700} height={400}>
						<Pie
							data={bars}
							cx="50%"
							cy="50%"
							innerRadius={100}
							outerRadius={200}
							fill={blue[500]}
						/>
					</PieChart>
				)}

				{chart === "word" && (
					<Box>
						<WordCloud
							words={words}
							minSize={[400, 400]}
							options={{
								deterministic: true,
								rotations: 0,
								fontSizes: [40, 120],
								padding: 30,
								fontFamily: "Roboto",
							}}
							callbacks={{
								getWordColor: (word) => word.color,
							}}
						/>
					</Box>
				)}
			</Box>
		</React.Fragment>
	);
}

export default ResultsO;
