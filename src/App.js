import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import EventViewP from "./components/EventViewP";
import VoteP from "./components/VoteP";
import ResultsP from "./components/ResultsP";
import CreateEvent from "./components/CreateEvent";
import NewPoll from "./components/NewPoll";
import EditEvent from "./components/EditEvent";
import ResultsO from "./components/ResultsO";
import { io } from "socket.io-client";

function App() {
	const socket = io();

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route
						exact
						path="/p/event/:eventId"
						element={<EventViewP socket={socket} />}
					/>
					<Route exact path="/p/event/:eventId/poll/:pollId" element={<VoteP socket={socket} />} />
					<Route exact path="/p/event/:eventId/poll/:pollId/results" element={<ResultsP socket={socket} />} />
					<Route exact path="/o/event/:eventId" element={<CreateEvent socket={socket} />} />
					<Route exact path="/o/event/:eventId/newPoll/:pollId" element={<NewPoll />} />
					<Route exact path="/o/event/:eventId/edit" element={<EditEvent socket={socket} />} />
					<Route exact path="/o/event/:eventId/poll/:pollId/results" element={<ResultsO socket={socket} />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;