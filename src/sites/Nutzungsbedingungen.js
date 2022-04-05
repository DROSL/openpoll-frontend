import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function Site() {
	return (
		<Box p={3}>
			<Stack direction="column" spacing={3}>
				<Typography
					variant="h4"
					component="h1"
					sx={{ wordWrap: "break-word" }}
				>
					Nutzungsbedingungen
				</Typography>

				<Typography>
					Sei nicht bösartig oder missbrauchend und mache nichts
					illegales.
				</Typography>
				<Typography>
					Wir hoffen, dass dir dieser Dienst nützt, aber
					Erreichbarkeit und Performanz können nicht garantiert
					werden. Bitte exportiere deine Daten regelmäßig.
				</Typography>
				<Typography>
					OSOP-Inhalte können von allen gelesen oder bearbeitet
					werden, die den Fragmentbezeichner des Dokuments erraten
					oder auf eine andere Art davon erfahren. Wir empfehlen dir
					Ende-Zu-Ende verschlüsselte Nachrichtentechnik (e2ee) zum
					Versenden der URLs zu nutzen. Wir übernehmen keine Haftung,
					falls eine URL erschlichen oder abgegriffen wird.
				</Typography>
				<Typography>
					Metadaten, die dein Browser übermittelt, können geloggt
					werden, um den Dienst aufrechtzuerhalten.
				</Typography>
				<Typography>
					Wir geben keine persönlichen Daten an Dritte weiter, außer
					auf richterliche Anordnung.
				</Typography>
				<Typography>
					Inaktive Veranstaltungen werden nach 30 Tagen automatisch
					gelöscht.
				</Typography>
			</Stack>
		</Box>
	);
}

export default Site;
