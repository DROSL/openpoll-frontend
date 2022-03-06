import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CloseIcon from "@mui/icons-material/Close";

const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function CreatePollDialog(props) {
	const { open, handleClose, handleCreate } = props;

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	const [title, setTitle] = useState("");
	const [answers, setAnswers] = useState([""]);
	const [checked, setChecked] = useState(false);
	const [count, setCount] = useState(1);

	useEffect(() => {
		setTitle("");
		setAnswers([""]);
		setChecked(false);
		setCount(1);
	}, [open]);

	const createCreateHandler = () => {
		handleCreate(title, answers, checked, count);
	};

	const handleChange = (event) => {
		// TODO: positive integer verification
		setCount(event.target.value);
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
				<DialogTitle>Neue Abstimmung</DialogTitle>
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
							Neue Abstimmung
						</Typography>
						<Button
							autoFocus
							color="inherit"
							onClick={createCreateHandler}
						>
							Speichern
						</Button>
					</Toolbar>
				</AppBar>
			)}
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					fullWidth
					multiline
					maxRows={3}
					variant="standard"
					label="Titel"
					placeholder="Welcher ist der längste Fluss der Welt?"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<Typography sx={{ mt: 2 }}>Antworten:</Typography>
				<List>
					{answers.map((value, index) => (
						<ListItem key={`answer-${index}`}>
							<ListItemIcon>
								{index === answers.length - 1 ? (
									<RadioButtonUncheckedIcon />
								) : (
									<CircleIcon
										sx={{
											color: ANSWER_COLORS[
												index % ANSWER_COLORS.length
											],
										}}
									/>
								)}
							</ListItemIcon>
							<ListItemText>
								<TextField
									fullWidth
									variant="standard"
									placeholder={`Antwort ${index + 1}`}
									value={value}
									onChange={(e) => {
										setAnswers([
											...answers.map((a, i) =>
												index === i ? e.target.value : a
											),
											...(index === answers.length - 1
												? [""]
												: []),
										]);
									}}
								/>
							</ListItemText>
							<Box sx={{ width: 40, ml: 3 }}>
								{index < answers.length - 1 && (
									<IconButton
										onClick={() => {
											setAnswers(
												answers.filter(
													(a, i) => index !== i
												)
											);
										}}
									>
										<CloseIcon />
									</IconButton>
								)}
							</Box>
						</ListItem>
					))}
				</List>

				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								value={checked}
								onChange={(e) => {
									setChecked(e.target.checked);
								}}
							/>
						}
						label="Teilnehmer dürfen eigene Antworten hinzufügen"
					/>
				</FormGroup>

				<Box sx={{ mt: 1, display: "flex", alignItems: "baseline" }}>
					<TextField
						variant="standard"
						type="number"
						inputProps={{ min: 1 }}
						sx={{ width: 50 }}
						value={count}
						onChange={handleChange}
					/>
					<Typography sx={{ ml: 1 }}>
						{count > 1
							? " Stimmen pro Teilnehmer"
							: " Stimme pro Teilnehmer"}
					</Typography>
				</Box>
			</DialogContent>

			{desktop && (
				<DialogActions>
					<Button onClick={handleClose}>Abbrechen</Button>
					<Button onClick={createCreateHandler}>Speichern</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default CreatePollDialog;
