import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import image from "../images/onsen.svg";

function Filler(props) {
	const { handleBack, handleResults } = props;

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
				<img src={image} alt="Abstimmung wurde beendet" width="150px" />
				<Typography sx={{ mt: 2, fontWeight: "bold" }}>
					Danke fürs Abstimmen!
				</Typography>
				<Typography align="center">
					Sie haben alle Ihre Stimmen genutzt.
				</Typography>
				<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
					<Button
						size="large"
						variant="contained"
						color="inherit"
						disableElevation
						sx={{ width: 136 }}
						onClick={handleBack}
					>
						Zurück
					</Button>
					<Button
						size="large"
						variant="contained"
						color="primary"
						disableElevation
						sx={{ width: 136 }}
						onClick={handleResults}
					>
						Ergebnisse
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default Filler;
