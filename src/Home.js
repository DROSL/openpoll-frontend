import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function Home() {
	const [view, setView] = useState(null);

	const [code, setCode] = useState("");
	const [title, setTitle] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		setCode("");
		setTitle("");
		setError(false);
	}, [view]);

	const createChangeHandler = (setState) => (event) => {
		setState(event.target.value);
	};

	const handleClickJoin = () => {
		setError(false);

		if (code) {
			setLoading(true);

			fetch(`/events/${code}/join`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code }),
			})
				.then((res) => {
					if (res.ok) {
						setRedirect(`/p/event/${code}`);
					} else {
						throw "Not ok";
					}
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
					setError(true);
				});
		}
	};

	const handleClickCreate = () => {
		setLoading(true);

		fetch("/events", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title }),
		})
			.then((res) => res.json())
			.then((data) => {
				setRedirect(`/o/event/${data.code}`);
			})
			.catch((err) => {
				setLoading(false);
				setError(true);
			});
	};

	const createEnterHandler = (handler) => (event) => {
		setError(false);

		if (event.keyCode === 13) {
			handler();
		}
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
				display: "flex",
				p: 3,
				boxSizing: "border-box",
			}}
		>
			<Stack
				spacing={2}
				direction="column"
				sx={(theme) => ({
					margin: "auto",
					width: "100%",
					maxWidth: 500,
				})}
			>
				{view === "join" && (
					<React.Fragment>
						<TextField
							fullWidth
							autoFocus
							variant="outlined"
							label="Code"
							{...(error && {
								error: true,
								helperText: "Ungültiger Code",
							})}
							value={code}
							onChange={createChangeHandler(setCode)}
							onKeyDown={createEnterHandler(handleClickJoin)}
						/>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							disabled={loading}
							onClick={handleClickJoin}
						>
							Veranstaltung beitreten
						</Button>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							color="inherit"
							disabled={loading}
							onClick={() => {
								setView(null);
							}}
						>
							Abbrechen
						</Button>
					</React.Fragment>
				)}

				{view === "create" && (
					<React.Fragment>
						{error ? (
							<Alert severity="error">
								Konnte keine neue Veranstaltung erstellen
							</Alert>
						) : null}

						<TextField
							fullWidth
							autoFocus
							variant="outlined"
							label="Titel"
							value={title}
							onChange={createChangeHandler(setTitle)}
							onKeyDown={createEnterHandler(handleClickCreate)}
						/>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							disabled={loading}
							onClick={handleClickCreate}
						>
							Veranstaltung erstellen
						</Button>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							color="inherit"
							disabled={loading}
							onClick={() => {
								setView(null);
							}}
						>
							Abbrechen
						</Button>
					</React.Fragment>
				)}

				{view === null && (
					<React.Fragment>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							disabled={loading}
							onClick={() => {
								setView("join");
							}}
						>
							Veranstaltung beitreten
						</Button>
						<Button
							fullWidth
							disableElevation
							size="large"
							variant="contained"
							disabled={loading}
							onClick={() => {
								setView("create");
							}}
						>
							Neue Veranstaltung
						</Button>
					</React.Fragment>
				)}

				{loading ? <CircularProgress size={24} /> : null}
			</Stack>
		</Box>
	);
}

export default Home;
