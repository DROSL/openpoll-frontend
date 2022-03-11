import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function DeleteEventDialog(props) {
	const { open, handleCancel, handleConfirm } = props;

	return (
		<Dialog open={open} onClose={handleCancel} maxWidth="xs">
			<DialogTitle>Veranstaltung löschen</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Möchten Sie die Veranstaltung wirklich für alle Teilnehmer
					löschen? Alle gespeicherten Abstimmungen und Ergebnisse
					werden unwiderruflich gelöscht.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Abbrechen</Button>
				<Button onClick={handleConfirm} autoFocus>
					Endgültig löschen
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DeleteEventDialog;
