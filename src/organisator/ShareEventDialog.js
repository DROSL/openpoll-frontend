import React, { useState } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ShareEventDialog(props) {
	const { open, handleClose, code, secret, joinable, handleChangeJoinable } =
		props;

	const codeLink = `${window.location.origin}/c/${code}`;
	const secretLink = `${window.location.origin}/s/${secret}`;

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const [tab, setTab] = useState(0);
	const [showLink, setShowLink] = useState(true);

	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	const createCopyHandler = (link) => () => {
		navigator.clipboard.writeText(link).then(
			function () {
				// success
			},
			function () {
				// error
			}
		);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			fullScreen={!desktop}
			TransitionComponent={Transition}
		>
			{desktop ? (
				<DialogTitle>Veranstaltung teilen</DialogTitle>
			) : (
				<AppBar position="static">
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant="h6"
							component="div"
						>
							Veranstaltung teilen
						</Typography>
					</Toolbar>
				</AppBar>
			)}
			<DialogContent>
				<Tabs
					variant={desktop ? "standard" : "fullWidth"}
					value={tab}
					onChange={handleTabChange}
				>
					<Tab label="Teilnehmer" />
					<Tab label="Organisatoren" />
				</Tabs>
				{tab === 0 && (
					<Box mt={2}>
						<Stack>
							<FormControl>
								<FormControlLabel
									control={
										<Switch
											checked={joinable}
											onChange={(e) => {
												handleChangeJoinable(
													e.target.checked
												);
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
										value={showLink ? codeLink : code}
										onFocus={(e) => {
											e.target.select();
										}}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													edge="end"
													onClick={createCopyHandler(
														showLink
															? codeLink
															: code
													)}
												>
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

				{tab === 1 && (
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
								value={secretLink}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											edge="end"
											onClick={createCopyHandler(
												secretLink
											)}
										>
											<ContentCopyIcon />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Stack>
				)}
			</DialogContent>
			{desktop && (
				<DialogActions>
					<Button onClick={handleClose}>Schließen</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default ShareEventDialog;
