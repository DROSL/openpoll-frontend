import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import mytheme from "./theme";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import AppBar from "./layout/AppBar";
import Drawer from "./layout/Drawer";
import Footer from "./layout/Footer";

import Home from "./Home";

import ManageEvent from "./organisator/ManageEvent";
import ViewEvent from "./participant/ViewEvent";

import JoinOrganisator from "./organisator/Join";
import JoinParticipant from "./participant/Join";

import Vote from "./participant/Vote";

import ResultsOrganisator from "./organisator/Results";
import ResultsParticipant from "./participant/Results";

import Nutzungsbedingungen from "./sites/Nutzungsbedingungen";

import NotFound from "./NotFound";

import { io } from "socket.io-client";
const socket = io();

function App() {
	const [open, toggleDrawer] = useState(false);

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<ThemeProvider theme={mytheme}>
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
									path="/o/event/:eventId"
									element={<ManageEvent socket={socket} />}
								/>
								<Route
									exact
									path="/p/event/:eventId"
									element={<ViewEvent socket={socket} />}
								/>
								<Route
									exact
									path="/p/event/:eventId/poll/:pollId"
									element={<Vote socket={socket} />}
								/>
								<Route
									exact
									path="/o/event/:eventId/poll/:pollId/results"
									element={
										<ResultsOrganisator socket={socket} />
									}
								/>
								<Route
									exact
									path="/p/event/:eventId/poll/:pollId/results"
									element={
										<ResultsParticipant socket={socket} />
									}
								/>
								<Route
									exact
									path="/c/:eventId"
									element={
										<JoinParticipant socket={socket} />
									}
								/>
								<Route
									exact
									path="/s/:secret"
									element={
										<JoinOrganisator socket={socket} />
									}
								/>
								<Route
									exact
									path="/nutzungsbedingungen"
									element={<Nutzungsbedingungen />}
								/>
								<Route exact path="/" element={<Home />} />
								<Route exact path="*" element={<NotFound />} />
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
