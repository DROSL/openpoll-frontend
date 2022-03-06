import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ListPolls(props) {
	const { eventId, polls, startVoting, showResults } = props;

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
					{activePolls.map((poll) => (
						<ListItem
							{...(!desktop && {
								button: true,
								onClick: () => {
									startVoting(poll._id);
								},
							})}
						>
							<ListItemText
								primary={poll.title}
								secondary="03:54 verbleibend"
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
					{finishedPolls.map((poll) => (
						<ListItem
							{...(!desktop && {
								button: true,
								onClick: () => {
									startVoting(poll._id);
								},
							})}
						>
							<ListItemText
								primary={poll.title}
								secondary="153 Abstimmungen"
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
