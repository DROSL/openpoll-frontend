import Box from "@mui/material/Box";

import WordCloud from "react-wordcloud";

//const ANSWER_COLORS = ["#32a852", "#4287f5", "#fcba03", "#db4437"];

function CustomWordCloud(props) {
	const { data } = props;

	const words = data
		.filter((answer) => !answer.hidden && answer.votes > 0)
		.map((answer, index) => ({
			text: answer.title,
			value: answer.votes,
			//color: ANSWER_COLORS[index % ANSWER_COLORS.length],
		}));

	return (
		<Box>
			<WordCloud
				words={words}
				minSize={[400, 400]}
				options={{
					deterministic: true,
					rotations: 0,
					fontSizes: [40, 120],
					padding: 30,
					fontFamily: "Roboto",
					transitionDuration: 0,
				}}
				callbacks={
					{
						//getWordColor: (word) => word.color,
					}
				}
			/>
		</Box>
	);
}

export default CustomWordCloud;
