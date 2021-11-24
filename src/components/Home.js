import * as React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";

class Home extends React.Component {
	state = {
		showJoin: false,
		redirect: null,
		loading: false,
		error: false,
	};

	toggleJoin = () => {
		this.setState((prev) => ({ showJoin: !prev.showJoin, error: false }));
	};

	joinEvent = () => {
		this.setState({ loading: true, error: false });
		setTimeout(() => {
			this.setState({ redirect: "/p/event/123" });
			//this.setState({ loading: false, error: true });
		}, 1000);
	};

	newEvent = () => {
		this.setState({ loading: true, error: false });
		setTimeout(() => {
			this.setState({ redirect: "/o/event/123" });
			//this.setState({ loading: false, error: true });
		}, 1000);
	};

	render() {
		const { showJoin, redirect, loading, error } = this.state;

		if (redirect) {
			return <Navigate to={redirect} />;
		}

		return (
			<React.Fragment>
				<Box>
					<Stack spacing={2} direction="column" alignItems="center">
						{showJoin ? (
							<React.Fragment>
								{error ? (
									<Alert severity="error">
										Konnte keiner Veranstaltung beitreten!
									</Alert>
								) : null}
								<TextField variant="outlined" label="Code" />
								<Button
									variant="contained"
									onClick={this.joinEvent}
									disabled={loading}
								>
									Veranstaltung beitreten
								</Button>
								<Button
									variant="contained"
									color="inherit"
									onClick={this.toggleJoin}
									disabled={loading}
								>
									Zurück
								</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								{error ? (
									<Alert severity="error">
										Konnte keine neue Veranstaltung
										erstellen!
									</Alert>
								) : null}
								<Button
									variant="contained"
									onClick={this.toggleJoin}
									disabled={loading}
								>
									Veranstaltung beitreten
								</Button>
								<Button
									variant="contained"
									onClick={this.newEvent}
									disabled={loading}
								>
									Neue Veranstaltung
								</Button>
							</React.Fragment>
						)}
						{loading ? <CircularProgress size={24} /> : null}
					</Stack>
				</Box>
			</React.Fragment>
		);
	}
}

export default Home;
