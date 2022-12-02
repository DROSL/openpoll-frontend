import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

function APIError() {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 3,
				boxSizing: "border-box",
			}}
		>
			<Box sx={{ width: 300 }}>
				<LinearProgress />
			</Box>
		</Box>
	);
}

export default APIError;
