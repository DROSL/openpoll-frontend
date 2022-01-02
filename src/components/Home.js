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
		showCreate: false,
		redirect: null,
		loading: false,
		error: null,
		eventCode: null,
		eventTitle: null,
		containerWidth: '100%',
	};

	componentDidMount() {
		window.addEventListener('resize', this.handleWindowSizeChange);
	}

	handleWindowSizeChange = () => {
		const windowWidth = window.innerWidth;
		this.setState({ containerWidth: windowWidth > 768 ? '60%' : windowWidth });
	}

	status = (res) => {
		if (!res.ok) {
			return Promise.reject()
		}
		return res;
	}

	toggleJoin = () => {
		this.setState((prev) => ({ showJoin: !prev.showJoin, error: false, eventCode: null }));
	};

	toggleCreate = () => {
		this.setState((prev) => ({ showCreate: !prev.showCreate, error: false }));
	};

	joinEvent = () => {
		this.setState({ error: false })
		if (this.state.eventCode) {
			this.setState({ loading: true })
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: this.state.eventCode })
			}
			fetch(process.env.REACT_APP_API_URL + `/events/${this.state.eventCode}/join`, requestOptions)
				.then(this.status)
				.then(data =>
					this.setState({ loading: false, redirect: `/p/event/${this.state.eventCode}` })
				)
				.catch(error => {
					this.setState({ error: true, loading: false })
				})
		}
	};

	newEvent = () => {
		this.setState({ error: null, showCreate: true });
	};

	createEvent = () => {
		this.setState({ loading: true })
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: this.state.eventTitle })
		}
		fetch(process.env.REACT_APP_API_URL + "/events", requestOptions)
			.then(response => response.json())
			.then(data =>
				this.setState({ redirect: `/o/event/${data.code}` })
			)
			.catch(error => {
				this.setState({ error: true, loading: false })
			})
	}

	handleKeyDown = (e) => {
		this.setState({ error: false })
		if (e.key === 'Enter') {
			this.joinEvent();
		}
	}


	render() {
		const { showJoin, showCreate, redirect, loading, error, containerWidth } = this.state;

		if (redirect) {
			return <Navigate to={redirect} />;
		}

		return (
			<React.Fragment>
				<Box sx={{
					width: { containerWidth },
					marginTop: '40vh',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<Stack spacing={2} direction="column" sx={{
						margin: 'auto',
						width: '75%',
						maxWidth: '500px',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						{showJoin ? (
							<React.Fragment>
								{error ? (
									<Alert severity="error">
										Konnte keiner Veranstaltung beitreten!
									</Alert>
								) : null}
								<TextField
									sx={{
										width: '100%',
									}}
									color={error ? 'error' : 'primary'}
									onChange={(e) => this.setState({ eventCode: e.target.value })} variant="outlined" label="Code"
									onKeyDown={this.handleKeyDown} />
								<Button
									size="large"
									sx={{
										width: '100%',
									}}
									variant="contained"
									onClick={this.joinEvent}
									disabled={loading}
								>
									Veranstaltung beitreten
								</Button>
								<Button
									size="large"
									sx={{
										width: '100%',
									}}
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
								{showCreate ?
									(<React.Fragment>
										{error ? (
											<Alert severity="error">
												Konnte keine Veranstaltung erstellen!
											</Alert>
										) : null}
										<TextField
											sx={{
												width: '100%',
											}}
											onChange={(e) => this.setState({ eventTitle: e.target.value })} variant="outlined" label="Titel" />
										<Button
											size="large"
											sx={{
												width: '100%',
											}}
											variant="contained"
											onClick={this.createEvent}
											disabled={loading}
										>
											Veranstaltung erstellen
										</Button>
										<Button
											size="large"
											sx={{
												width: '100%',
											}}
											variant="contained"
											color="inherit"
											onClick={this.toggleCreate}
											disabled={loading}
										>
											Zurück
										</Button>
									</React.Fragment>)
									:
									(
										<React.Fragment>
											{error ? (
												<Alert severity="error">
													Konnte keiner Veranstaltung beitreten!
												</Alert>
											) : null}
											<Button
												size="large"
												sx={{
													width: '100%',
												}}
												variant="contained"
												onClick={this.toggleJoin}
												disabled={loading}
											>
												Veranstaltung beitreten
											</Button>
											<Button
												size="large"
												sx={{
													width: '100%',
												}}
												variant="contained"
												onClick={this.newEvent}
												disabled={loading}
											>
												Neue Veranstaltung
											</Button>
										</React.Fragment>)}
							</React.Fragment>
						)
						}
						{loading ? <CircularProgress size={24} /> : null}
					</Stack >
				</Box >
			</React.Fragment >
		);
	}
}

export default Home;
