import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import image from "./images/error.svg";

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
			<Stack direction="column" alignItems="center">
				<img src={image} alt="Backend nicht erreichbar" width="100px" />
				<Typography variant="h6" sx={{ mt: 3 }}>
					Backend nicht erreichbar
				</Typography>
				<Typography align="center" sx={{ mt: 1 }}>
					Der Backend-Server konnte nicht erreicht werden. Versuchen
					Sie es später noch einmal!
				</Typography>
				<Button
					size="large"
					variant="contained"
					color="primary"
					disableElevation
					sx={{ mt: 3 }}
					onClick={() => {
						window.location.reload();
					}}
				>
					Neu laden
				</Button>
			</Stack>
		</Box>
	);
}

export default APIError;
