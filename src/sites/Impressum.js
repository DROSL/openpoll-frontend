import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

function Impressum() {
	return (
		<Box p={3}>
			<Stack direction="column" spacing={3}>
				<Alert severity="warning">
					Dieses Impressum wurde von <strong>ovgu.de</strong>{" "}
					übernommen und muss ggf. angepasst werden!
				</Alert>

				<Typography variant="h4" component="h1">
					Impressum
				</Typography>

				<Typography>
					Die Otto-von-Guericke-Universität Magdeburg ist eine
					Körperschaft des öffentlichen Rechts.
					<br />
					Sie wird vertreten durch den Rektor:
					<br />
					Prof. Dr.-Ing. Jens Strackeljan
					<br />
					Universitätsplatz 2
					<br />
					D-39106 Magdeburg
				</Typography>

				<Typography variant="h6" component="h2">
					Kontakt
				</Typography>
				<Typography>
					Telefon: 49-(0)391-6701 (Telefonzentrale)
					<br />
					Telefax: 49-(0)391-67-11157
					<br />
					E-Mail:{" "}
					<Link href="mailto:rektor@ovgu.de">rektor@ovgu.de</Link>
				</Typography>

				<Typography variant="h6" component="h2">
					Zuständige Aufsichtsbehörde
				</Typography>
				<Typography>
					Ministerium für Wissenschaft, Energie, Klimaschutz und
					Umwelt des Landes Sachsen-Anhalt
					<br />
					Leipziger Straße 58
					<br />
					39112 Magdeburg
					<br />
					E-Mail:{" "}
					<Link href="mailto:poststelle@mwu.sachsen-anhalt.de">
						poststelle@mwu.sachsen-anhalt.de
					</Link>
					<br />
					<Link href="www.mwu.sachsen-anhalt.de">
						www.mwu.sachsen-anhalt.de
					</Link>
				</Typography>

				<Typography variant="h6" component="h2">
					Umsatzsteueridentifikationsnummer
				</Typography>
				<Typography>DE 139 238 413</Typography>

				<Typography variant="h6" component="h2">
					Redaktionell verantwortlich
				</Typography>
				<Typography>
					Die redaktionelle Verantwortlichkeit für diese Webseite
					liegt im Bereich Medien, Kommunikation und Marketing der
					Otto-von-Guericke-Universität Magdeburg. Bei Fragen,
					Hinweisen, etc. schreiben Sie bitte an:{" "}
					<Link href="mailto:presseteam@ovgu.de">
						presseteam@ovgu.de
					</Link>
				</Typography>
				<Typography>
					Für die Erstellung, Inhalte und Pflege von Webseiten, die im
					Zusammenhang mit einer beruflichen oder studentischen
					Tätigkeit an der OVGU entstehen, sind die jeweiligen
					Einrichtungen, Mitglieder bzw. Angehörigen der
					Otto-von-Guericke-Universität Magdeburg selbst
					verantwortlich.
				</Typography>
			</Stack>
		</Box>
	);
}

export default Impressum;
