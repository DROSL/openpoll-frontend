import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import image from "./images/bear.svg";

function NotFound() {
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
				<img src={image} alt="Seite nicht gefunden" width="150px" />
				<Typography sx={{ mt: 2, fontWeight: "bold" }}>
					Seite nicht gefunden
				</Typography>
				<Typography align="center">
					Das hat nicht geklappt. Die angeforderte Seite existiert
					nicht.
				</Typography>
				<Button
					LinkComponent={Link}
					to="/"
					size="large"
					variant="contained"
					color="primary"
					disableElevation
					sx={{ mt: 2 }}
				>
					Zur Startseite
				</Button>
			</Stack>
		</Box>
	);
}

export default NotFound;
