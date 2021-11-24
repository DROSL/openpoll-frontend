import * as React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from '@mui/icons-material/Close';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function EventViewP() {
	const [open, setOpen] = React.useState(true);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	let params = useParams();

	return (
		<Box>
			<div>Event-ID: {params.eventId}</div>
			<Typography variant="h4" component="h1">
				Titel der Veranstaltung
			</Typography>
			<Typography>
				But I must explain to you how all this mistaken idea of
				denouncing pleasure and praising pain was born and I will give
				you a complete account of the system, and expound the actual
				teachings of the great explorer of the truth, the master-builder
				of human happiness. No one rejects, dislikes, or avoids pleasure
				itself, because it is pleasure, but because those who do not
				know how to pursue pleasure.
			</Typography>
			<Stack direction="row" spacing={1}>
				<AttachFileIcon />
				<Stack direction="column">
					<Typography>ablauf-2020.pdf</Typography>
					<Typography>2 MB</Typography>
				</Stack>
				<IconButton color="primary">
					<DownloadIcon />
				</IconButton>
			</Stack>
			<Button variant="contained">An Abstimmung teilnehmen</Button>
			<Button variant="contained" color="error">
				Veranstaltung verlassen
			</Button>
			<Typography variant="caption">Präsentiert von:</Typography>
			<img
				src="https://europa.sachsen-anhalt.de/fileadmin/_processed_/8/2/csm_EFRE_mit_Rand_80528e161b.png"
				alt="Sponsor"
				width="50%"
			/>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
                    Eine neue Abstimmung ist aktiv!
                </DialogTitle>
				<DialogContent>
                    <Stack direction="column" spacing={2}>
                    <Typography>Welches Essen schmeckt am besten?</Typography>
					<Button onClick={handleClose} variant="contained" autoFocus>Teilnehmen</Button>
					<Button onClick={handleClose} variant="contained" color="inherit">Ignorieren</Button>
						<Typography variant="caption">Sie können auch zu einem späteren Zeitpunkt an der Abstimmung teilnehmen.</Typography>
                    </Stack>
				</DialogContent>
			</Dialog>
		</Box>
	);
}

export default EventViewP;
