import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import AppBar from "./layout/AppBar";
import Drawer from "./layout/Drawer";
import Footer from "./layout/Footer";

import Home from "./components/Home";
import EventViewP from "./components/EventViewP";
import VoteP from "./components/VoteP";
import ResultsP from "./components/ResultsP";
import CreateEvent from "./components/CreateEvent";
import NewPoll from "./components/NewPoll";
import EditEvent from "./components/EditEvent";
import ResultsO from "./components/ResultsO";
import JoinO from "./components/JoinO";
import JoinP from "./components/JoinP";
import { io } from "socket.io-client";

function App() {
	const socket = io();

	const [open, toggleDrawer] = useState(false);

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Drawer open={open} toggleDrawer={toggleDrawer} />
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						overflow: "hidden",
						backgroundColor: "#e8e8e8",
					}}
				>
					<Box
						sx={(theme) => ({
							position: "relative",
							width: "100%",
							maxWidth: theme.breakpoints.values.lg,
							[theme.breakpoints.up("lg")]: {
								top: 19,
								height: "calc(100% - 38px)",
							},
							[theme.breakpoints.down("lg")]: {
								top: 0,
								height: "100%",
							},
							margin: "0 auto",
							display: "flex",
							flexDirection: "column",
							backgroundColor: "#ffffff",
							boxShadow: 1,
						})}
					>
						<AppBar desktop={desktop} toggleDrawer={toggleDrawer} />
						<Box
							sx={{
								flex: 1,

								overflowX: "hidden",
								overflowY: "auto",
								scrollbarColor:
									"rgba(0,0,0,.2) rgba(255,255,255,.1)",
								scrollbarWidth: "thin",
							}}
						>
							<Routes>
								<Route
									exact
									path="/p/event/:eventId"
									element={<EventViewP socket={socket} />}
								/>
								<Route
									exact
									path="/p/event/:eventId/poll/:pollId"
									element={<VoteP socket={socket} />}
								/>
								<Route
									exact
									path="/p/event/:eventId/poll/:pollId/results"
									element={<ResultsP socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/:eventId"
									element={<CreateEvent socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/:eventId/newPoll/:pollId"
									element={<NewPoll socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/:eventId/edit"
									element={<EditEvent socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/:eventId/poll/:pollId/results"
									element={<ResultsO socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/join/:secretO"
									element={<JoinO socket={socket} />}
								/>
								<Route
									exact
									path="/p/event/join/:eventId"
									element={<JoinP socket={socket} />}
								/>
								<Route path="/" element={<Home />} />
							</Routes>
						</Box>
						{desktop ? (
							<React.Fragment>
								<Divider />
								<Footer />
							</React.Fragment>
						) : null}
					</Box>
				</Box>
			</Router>
		</ThemeProvider>
	);
}

export default App;
