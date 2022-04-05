import React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Button from "@mui/material/Button";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BarChartIcon from "@mui/icons-material/BarChart";

function ListPolls(props) {
	const { polls, startVoting, showResults } = props;

	const activePolls = polls.filter((poll) => poll.started && !poll.stopped);
	const finishedPolls = polls.filter((poll) => poll.started && poll.stopped);

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<React.Fragment>
			{activePolls.length > 0 && (
				<List
					subheader={
						<ListSubheader disableGutters>
							Aktive Abstimmung
						</ListSubheader>
					}
				>
					{activePolls.map((poll, index) => (
						<ListItem
							key={`poll-active-${index}`}
							{...(!desktop && {
								button: true,
								onClick: () => {
									startVoting(poll._id);
								},
							})}
						>
							<ListItemText
								primary={poll.title}
								secondary="Mehrere Antwortmöglichkeiten"
							/>
							{desktop && (
								<Button
									disableElevation
									variant="contained"
									startIcon={<PlayArrowIcon />}
									onClick={() => {
										startVoting(poll._id);
									}}
								>
									Teilnehmen
								</Button>
							)}
						</ListItem>
					))}
				</List>
			)}

			{finishedPolls.length > 0 && (
				<List
					subheader={
						<ListSubheader disableGutters>
							Beendete Abstimmungen
						</ListSubheader>
					}
				>
					{finishedPolls.map((poll, index) => (
						<ListItem
							key={`poll-finished-${index}`}
							{...(!desktop && {
								button: true,
								onClick: () => {
									showResults(poll._id);
								},
							})}
						>
							<ListItemText
								primary={poll.title}
								secondary="Mehrere Antwortmöglichkeiten"
							/>
							{desktop && (
								<Button
									disableElevation
									variant="contained"
									color="inherit"
									startIcon={<BarChartIcon />}
									onClick={() => {
										showResults(poll._id);
									}}
								>
									Ergebnisse
								</Button>
							)}
						</ListItem>
					))}
				</List>
			)}
		</React.Fragment>
	);
}

export default ListPolls;
