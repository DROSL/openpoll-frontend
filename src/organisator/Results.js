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

function Results(props) {
	const { socket } = props;
	const { pollId } = useParams();

	const theme = useTheme();

	const [redirect, setRedirect] = useState(null);

	const [poll, setPoll] = useState({
		title: "Untitled poll",
	});
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
				setPoll(data);
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
		fetch(`/polls/${pollId}/stop`, {
			method: "PUT",
		})
			.then((res) => {
				if (res.ok) {
					setPoll({ ...poll, stopped: true });
				} else {
					throw "Could not stop poll";
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

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
		.filter((result) => !result.hidden && result.votes > 0)
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
					{chart === "bar" && (
						<BarChart width={700} height={400} data={bars}>
							<XAxis
								dataKey="name"
								dy={10}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis axisLine={false} tickLine={false} />
							<CartesianGrid
								stroke={grey[300]}
								vertical={false}
							/>
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
									transitionDuration: 0,
								}}
								callbacks={{
									getWordColor: (word) => word.color,
								}}
							/>
						</Box>
					)}
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
