import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import CircleIcon from "@mui/icons-material/Circle";

const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

function ResultsList(props) {
	const { data } = props;

	const totalVotes = data.reduce(
		(counter, answer) => counter + answer.votes,
		0
	);

	return (
		<List sx={{ width: "100%", maxWidth: 600 }}>
			{data.map((answer, index) => (
				<ListItem button key={`result-${index}`}>
					<ListItemIcon>
						<CircleIcon
							sx={{
								color: ANSWER_COLORS[
									index % ANSWER_COLORS.length
								],
							}}
						/>
					</ListItemIcon>
					<ListItemText primary={answer.title} secondary="Antwortmöglichkeit" />
					{answer.votes}
				</ListItem>
			))}
		</List>
	);
}

export default ResultsList;
