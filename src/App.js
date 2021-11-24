import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import EventViewP from "./components/EventViewP";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route
						exact
						path="/p/event/:eventId"
						element={<EventViewP />}
					/>
					<Route exact path="/p/poll/:pollId" />
					<Route exact path="/p/poll/:pollId/results" />
					<Route exact path="/o/event/:eventId" />
					<Route exact path="/o/event/:eventId/new" />
					<Route exact path="/o/poll/:pollId" />
					<Route exact path="/o/poll/:pollId/results" />
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
