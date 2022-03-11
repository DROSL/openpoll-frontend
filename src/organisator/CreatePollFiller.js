import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import spooky from "../images/spooky.svg";

function CreatePollFiller(props) {
	const { handleClick } = props;

	return (
		<Box
			sx={{
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Stack direction="column" alignItems="center">
				<img
					src={spooky}
					alt="Noch keine Abstimmungen erstellt"
					width="150px"
				/>
				<Typography sx={{ mt: 2, fontWeight: "bold" }}>
					Ziemlich leer hier
				</Typography>
				<Typography align="center">
					Beginnen Sie, indem Sie Ihre erste Abstimmung erstellen!
				</Typography>
				<Button
					size="large"
					variant="contained"
					color="primary"
					disableElevation
					startIcon={<AddIcon />}
					onClick={handleClick}
					sx={{ mt: 2 }}
				>
					Neue Abstimmung
				</Button>
			</Stack>
		</Box>
	);
}

export default CreatePollFiller;
