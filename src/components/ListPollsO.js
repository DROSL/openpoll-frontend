import React, { useEffect, useState } from "react";

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

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BarChartIcon from "@mui/icons-material/BarChart";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ListPolls(props) {
	const {
		eventId,
		polls,
		startPoll,
		stopPoll,
		editPoll,
		deletePoll,
		showResults,
		deleteResults,
	} = props;

	const activePolls = polls.filter((poll) => poll.started && !poll.stopped);
	const savedPolls = polls.filter((poll) => !poll.started);
	const finishedPolls = polls.filter((poll) => poll.started && poll.stopped);

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const [selectedPoll, setSelectedPoll] = useState(null);

	const [anchorEl1, setAnchorEl1] = useState(null);
	const [anchorEl2, setAnchorEl2] = useState(null);
	const [anchorEl3, setAnchorEl3] = useState(null);

	const createClickHandler1 = (pollId) => (event) => {
		setSelectedPoll(pollId);
		setAnchorEl1(event.currentTarget);
		setAnchorEl2(null);
		setAnchorEl3(null);
	};

	const createClickHandler2 = (pollId) => (event) => {
		setSelectedPoll(pollId);
		setAnchorEl1(null);
		setAnchorEl2(event.currentTarget);
		setAnchorEl3(null);
	};

	const createClickHandler3 = (pollId) => (event) => {
		setSelectedPoll(pollId);
		setAnchorEl1(null);
		setAnchorEl2(null);
		setAnchorEl3(event.currentTarget);
	};

	const handleClose = () => {
		setSelectedPoll(null);
		setAnchorEl1(null);
		setAnchorEl2(null);
		setAnchorEl3(null);
	};

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
						<ListItem>
							<ListItemText
								primary={poll.title}
								secondary="03:54 verbleibend"
							/>
							<Stack direction="row" spacing={1}>
								{desktop && (
									<Button
										disableElevation
										variant="contained"
										startIcon={<BarChartIcon />}
										onClick={() => {
											showResults(poll._id);
										}}
									>
										Ergebnisse
									</Button>
								)}
								<IconButton
									onClick={createClickHandler1(poll._id)}
								>
									<MoreVertIcon />
								</IconButton>
							</Stack>
						</ListItem>
					))}
				</List>
			)}
			<Menu
				anchorEl={anchorEl1}
				open={Boolean(anchorEl1)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuItem disabled>Starten</MenuItem>
				<MenuItem
					onClick={() => {
						stopPoll(selectedPoll);
						handleClose();
					}}
				>
					Stoppen
				</MenuItem>
				<MenuItem
					onClick={() => {
						showResults(selectedPoll);
						handleClose();
					}}
				>
					Ergebnisse
				</MenuItem>
				<Divider sx={{ width: 200 }} />
				<MenuItem
					onClick={() => {
						deletePoll(selectedPoll);
						handleClose();
					}}
				>
					<Typography color="error">Löschen</Typography>
				</MenuItem>
			</Menu>

			{savedPolls.length > 0 && (
				<List
					subheader={
						<ListSubheader disableGutters>
							Geplante Abstimmungen
						</ListSubheader>
					}
				>
					{savedPolls.map((poll) => (
						<ListItem>
							<ListItemText
								primary={poll.title}
								secondary="4 Antwortmöglichkeiten"
							/>
							<Stack direction="row" spacing={1}>
								{desktop && activePolls.length == 0 && (
									<Button
										disableElevation
										variant="contained"
										startIcon={<PlayArrowIcon />}
										onClick={() => startPoll(poll._id)}
									>
										Starten
									</Button>
								)}
								<IconButton
									onClick={createClickHandler2(poll._id)}
								>
									<MoreVertIcon />
								</IconButton>
							</Stack>
						</ListItem>
					))}
				</List>
			)}
			<Menu
				anchorEl={anchorEl2}
				open={Boolean(anchorEl2)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuItem
					onClick={() => {
						startPoll(selectedPoll);
						handleClose();
					}}
					disabled={activePolls.length > 0}
				>
					Starten
				</MenuItem>
				<MenuItem disabled>Stoppen</MenuItem>
				<MenuItem
					onClick={() => {
						editPoll(selectedPoll);
						handleClose();
					}}
				>
					Bearbeiten
				</MenuItem>
				<Divider sx={{ width: 200 }} />
				<MenuItem
					onClick={() => {
						deletePoll(selectedPoll);
						handleClose();
					}}
				>
					<Typography color="error">Löschen</Typography>
				</MenuItem>
			</Menu>

			{finishedPolls.length > 0 && (
				<List
					subheader={
						<ListSubheader disableGutters>
							Beendete Abstimmungen
						</ListSubheader>
					}
				>
					{finishedPolls.map((poll) => (
						<ListItem>
							<ListItemText
								primary={poll.title}
								secondary="153 Abstimmungen"
							/>
							<IconButton onClick={createClickHandler3(poll._id)}>
								<MoreVertIcon />
							</IconButton>
						</ListItem>
					))}
				</List>
			)}
			<Menu
				anchorEl={anchorEl3}
				open={Boolean(anchorEl3)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuItem
					onClick={() => {
						showResults(selectedPoll);
						handleClose();
					}}
				>
					Ergebnisse anzeigen
				</MenuItem>
				<MenuItem
					onClick={() => {
						deleteResults(selectedPoll);
						handleClose();
					}}
				>
					Ergebnisse löschen
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						deletePoll(selectedPoll);
						handleClose();
					}}
				>
					<Typography color="error">Löschen</Typography>
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}

export default ListPolls;
