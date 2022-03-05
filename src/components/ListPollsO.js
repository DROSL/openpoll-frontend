import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteIcon from "@mui/icons-material/Delete";
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

	const activePolls = polls;
	const savedPolls = polls;
	const finishedPolls = polls;

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
								<Button
									component={Link}
									to={`/o/event/${eventId}/poll/${poll._id}/results`}
									variant="contained"
									startIcon={<BarChartIcon />}
									disableElevation
								>
									Ergebnisse
								</Button>
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
								{activePolls.length == 0 && (
									<Button
										variant="contained"
										startIcon={<PlayArrowIcon />}
										disableElevation
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
