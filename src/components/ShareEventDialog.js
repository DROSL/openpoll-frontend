import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ShareEventDialog(props) {
	const { open, handleClose, code, secret } = props;

	const [tab, setTab] = useState(0);
	const [showLink, setShowLink] = useState(false);

	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			TransitionComponent={Transition}
		>
			<DialogTitle>Veranstaltung teilen</DialogTitle>
			<DialogContent>
				<Tabs value={tab} onChange={handleTabChange}>
					<Tab label="Teilnehmer" />
					<Tab label="Organisatoren" />
				</Tabs>
				{tab == 0 && (
					<Box mt={2}>
						<Stack>
							<FormControl>
								<FormControlLabel
									control={
										<Switch
											checked={true}
											onChange={(e) => {
												//setJoinable(e.target.checked);
											}}
										/>
									}
									label="Neue Teilnehmer können der Veranstaltung beitreten"
								/>
							</FormControl>
							<Box mt={2}>
								<FormControl
									variant="outlined"
									fullWidth={showLink}
								>
									<OutlinedInput
										readOnly
										autoFocus
										value={
											showLink
												? `${window.location.origin}/c/${code}`
												: code
										}
										onFocus={(e) => {
											e.target.select();
										}}
										endAdornment={
											<InputAdornment position="end">
												<IconButton edge="end">
													<ContentCopyIcon />
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</Box>
							<Box mt={1}>
								<Button
									onClick={() => {
										setShowLink(!showLink);
									}}
								>
									{showLink
										? "Oder Code anzeigen"
										: "Oder Link erzeugen"}
								</Button>
							</Box>
						</Stack>
					</Box>
				)}
				{tab == 1 && (
					<Stack mt={2} spacing={2}>
						<Alert severity="warning">
							<AlertTitle>Achtung</AlertTitle>
							Organisatoren haben vollen Zugriff auf Ihre
							Veranstaltung. Teilen Sie den Link nur mit Personen,
							denen Sie vertrauen!
						</Alert>
						<FormControl variant="outlined">
							<OutlinedInput
								readOnly
								fullWidth
								autoFocus
								onFocus={(e) => {
									e.target.select();
								}}
								value={`${window.location.origin}/s/${secret}`}
								endAdornment={
									<InputAdornment position="end">
										<IconButton edge="end">
											<ContentCopyIcon />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Stack>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Schließen</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ShareEventDialog;
