import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";

import { grey, blue } from "@mui/material/colors";

function CustomBarChart(props) {
	const { data } = props;

	const bars = data
		.filter((answer) => !answer.hidden)
		.map((answer) => ({
			name: answer.title,
			value: answer.votes,
		}));

	return (
		<BarChart width={700} height={400} data={bars}>
			<XAxis dataKey="name" dy={10} axisLine={false} tickLine={false} />
			<YAxis axisLine={false} tickLine={false} />
			<CartesianGrid stroke={grey[300]} vertical={false} />
			<Bar
				isAnimationActive={true}
				type="monotone"
				dataKey="value"
				fill={blue[500]}
				maxBarSize={50}
			/>
		</BarChart>
	);
}

export default CustomBarChart;
